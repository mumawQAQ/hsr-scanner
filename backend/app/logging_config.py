import logging


class CustomFormatter(logging.Formatter):
    grey = "\x1b[38;21m"
    green = "\x1b[32;21m"
    yellow = "\x1b[33;21m"
    red = "\x1b[31;21m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    base_format = "%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d): %(message)s"

    LEVEL_COLORS = {
        logging.DEBUG: grey,
        logging.INFO: green,
        logging.WARNING: yellow,
        logging.ERROR: red,
        logging.CRITICAL: bold_red
    }

    def format(self, record):
        # Apply color only to the levelname part
        log_fmt = self.base_format.replace("[%(levelname)s]",
                                           self.LEVEL_COLORS[record.levelno] + "[%(levelname)s]" + self.reset)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


# Define the logging configuration
logging_config = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            '()': CustomFormatter
        },
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d): %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'ERROR',
            'formatter': 'detailed',
            'stream': 'ext://sys.stdout',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'ERROR',
            'formatter': 'standard',
            'filename': 'app.log',
            'mode': 'a',
            'maxBytes': 1000000,  # 1MB
            'backupCount': 5,
            'encoding': 'utf-8',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True
        },
    }
}

logger = logging.getLogger(__name__)
