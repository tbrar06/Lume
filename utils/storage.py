"""
Storage utility for persisting data to JSON files
"""

import json
import os
from typing import Dict, Any, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Storage:
    """Storage class for handling JSON file persistence with in-memory caching"""
    
    def __init__(self, data_dir: str = "data"):
        """Initialize storage with data directory"""
        self.data_dir = data_dir
        self.cache: Dict[str, Dict[str, Any]] = {}
        self._ensure_data_dir()
    
    def _ensure_data_dir(self):
        """Ensure data directory exists"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def _get_file_path(self, collection: str) -> str:
        """Get file path for collection"""
        return os.path.join(self.data_dir, f"{collection}.json")
    
    def _load_collection(self, collection: str) -> Dict[str, Any]:
        """Load collection from file"""
        file_path = self._get_file_path(collection)
        if not os.path.exists(file_path):
            return {}
        
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            logger.error(f"Error loading collection {collection}: {e}")
            # If the file is corrupted, return empty dict
            return {}
        except Exception as e:
            logger.error(f"Error loading collection {collection}: {e}")
            return {}
    
    def load_collection(self, collection: str) -> Dict[str, Any]:
        """Public method to load a collection from file or cache"""
        if collection in self.cache:
            return self.cache[collection]
        
        data = self._load_collection(collection)
        self.cache[collection] = data
        return data
    
    def _save_collection(self, collection: str, data: Dict[str, Any]):
        """Save collection to file"""
        file_path = self._get_file_path(collection)
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving collection {collection}: {e}")
    
    def get_all_items(self, collection: str) -> Dict[str, Any]:
        """Get all items in collection"""
        if collection not in self.cache:
            self.cache[collection] = self._load_collection(collection)
        return self.cache[collection]
    
    def get_item(self, collection: str, item_id: str) -> Optional[Any]:
        """Get item by ID"""
        items = self.get_all_items(collection)
        return items.get(item_id)
    
    def save_item(self, collection: str, item_id: str, item: Any):
        """Save item to collection"""
        items = self.get_all_items(collection)
        items[item_id] = item
        self._save_collection(collection, items)
        self.cache[collection] = items
    
    def delete_item(self, collection: str, item_id: str):
        """Delete item from collection"""
        items = self.get_all_items(collection)
        if item_id in items:
            del items[item_id]
            self._save_collection(collection, items)
            self.cache[collection] = items

# Create global storage instance
storage = Storage() 