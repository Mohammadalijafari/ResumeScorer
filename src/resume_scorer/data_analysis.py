import os
import sys
from utils.model_loader import ModelLoader
from logger.custom_logger import CustomLogger
from exceptions.custom_exception import ResumeAnalyserException
from models.models import *
from langchain_core.output_parsers import JsonOutputParser
from langchain_classic.output_parsers import OutputFixingParser
from prompts.prompts_library import PROMPT_REGISTRY


class ResumeAnalyser:

    def __init__(self, session_id: str):
        self.log = CustomLogger().get_logger(__name__)

        try:
            self.loader = ModelLoader()
            self.llm = self.loader.load_llm()

            self.parser = JsonOutputParser(pydantic_object=ResumeScore)
            self.fixing_parser = OutputFixingParser.from_llm(parser=self.parser, llm=self.llm)

            self.prompt = PROMPT_REGISTRY["resume_analysis"]

            self.log.info("Resume Analyzer initialized successfully")

        except Exception as e:
            self.log.error(f"Error initializing ResumeAnalyser: {e}")
            raise ResumeAnalyserException("Error initializing ResumeAnalyser", sys)

    def analyze_resume(self, resume_text: str, job_description: str) -> dict:
        try:
            chain = self.prompt | self.llm | self.fixing_parser
            self.log.info("Meta-data analysis chain initialized")
            self.log.info(f"Resume text length: {len(resume_text)}")
            self.log.info(f"Job description length: {len(job_description)}")

            response = chain.invoke({
                "format_instructions": self.parser.get_format_instructions(),
                "job_description": job_description,
                "resume_text": resume_text,
            })

            self.log.info(f"Raw LLM response type: {type(response)}")
            self.log.info(f"Raw LLM response: {response}")

            # Convert to dict if it's a Pydantic model
            if hasattr(response, "dict"):
                response_dict = response.dict()
            elif hasattr(response, "__dict__"):
                response_dict = response.__dict__
            else:
                response_dict = response

            self.log.info(f"Meta data extraction successful",
                          keys=list(response_dict.keys()) if isinstance(response_dict, dict) else "Not a dict")

            return response_dict

        except Exception as e:
            self.log.error(f"Meta data extraction failed: {str(e)}")
            self.log.error(f"Exception tye: {type(e)}")
            import traceback
            self.log.error(f"Traceback: {traceback.format_exc()}")
            raise ResumeAnalyserException("Meta date extraction failed", sys)
