from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class RecipeIngredientBase(BaseModel):
    ingredient_id: uuid.UUID
    quantity_required: float = Field(..., ge=0)
    unit: str

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredientResponse(RecipeIngredientBase):
    id: uuid.UUID
    ingredient_name: Optional[str] = None

    class Config:
        from_attributes = True

class RecipeCreate(BaseModel):
    menu_item_id: uuid.UUID
    ingredients: List[RecipeIngredientCreate]

class RecipeResponse(BaseModel):
    id: uuid.UUID
    menu_item_id: uuid.UUID
    ingredients: List[RecipeIngredientResponse]
    food_cost: float = 0.0

    class Config:
        from_attributes = True
