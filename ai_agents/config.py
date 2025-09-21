"""
Configuration settings for AI Agents
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost:5432/ai_analyst")
    
    # Redis Configuration
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Twilio Configuration
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    
    # SendGrid Configuration
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    
    # Backend API Configuration
    BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8080/api")
    
    # Agent Configuration
    AGENT_TIMEOUT = int(os.getenv("AGENT_TIMEOUT", "3600"))
    MAX_RETRY_ATTEMPTS = int(os.getenv("MAX_RETRY_ATTEMPTS", "3"))
    CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.7"))
    
    # File Processing Configuration
    MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "100"))
    SUPPORTED_FILE_TYPES = os.getenv("SUPPORTED_FILE_TYPES", "pdf,docx,pptx,txt,mp3,mp4,wav").split(",")
    UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIRECTORY", "./uploads")
    
    # Search Configuration
    SEARCH_RESULTS_LIMIT = int(os.getenv("SEARCH_RESULTS_LIMIT", "30"))
    SEARCH_TIMEOUT = int(os.getenv("SEARCH_TIMEOUT", "300"))
    
    # Model Configuration
    DEFAULT_MODEL = "gpt-4o"
    EMBEDDING_MODEL = "text-embedding-3-small"
    TEMPERATURE = 0.1
    
    # Vector Store Configuration
    VECTOR_STORE_PATH = "./vector_store"
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
