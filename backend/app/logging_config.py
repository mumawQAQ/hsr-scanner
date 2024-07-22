import logging
import sys
from logging.handlers import RotatingFileHandler

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s [%(levelname)s] %(message)s",
                    handlers=[
                        RotatingFileHandler("app.log", maxBytes=1000000, backupCount=5, encoding='utf-8'),
                        logging.StreamHandler(sys.stdout)
                    ])

logger = logging.getLogger(__name__)
