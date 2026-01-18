from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the ml-backend directory to the python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../ml-backend'))

from app.main import app

# Vercel requires the app instance to be the entry point
# We re-declare it here implicitly by importing it, 
# but for Vercel Serverless Function, it looks for a handler.
# With FastAPI on Vercel, the app instance itself is sufficient if configured in vercel.json
