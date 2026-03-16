from typing import Optional, List
from pydantic import BaseModel, Field
import uuid

# ==========================================
# Menu Category Schemas
# ==========================================
class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    icon: Optional[str] = Field(default="🍽️", max_length=10)

class CategoryResponse(BaseModel):
    id: uuid.UUID
    restaurant_id: uuid.UUID
    name: str
    icon: Optional[str]
    sort_order: int

# ==========================================
# Menu Item Recipe Schemas
# ==========================================
class RecipeIngredient(BaseModel):
    ingredient_id: uuid.UUID
    ingredient_name: Optional[str] = None
    quantity_required: float = Field(..., ge=0)
    unit: str = Field(..., max_length=20)

# ==========================================
# Menu Item Schemas
# ==========================================
class MenuItemCreate(BaseModel):
    category_id: uuid.UUID
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    image_url: Optional[str] = None
    is_veg: bool = True
    is_available: bool = True
    is_bestseller: bool = False
    prep_time_minutes: int = Field(default=15, ge=1)
    making_cost: float = Field(default=0, ge=0)
    recipe: Optional[List[RecipeIngredient]] = Field(default_factory=list)

class MenuItemUpdate(BaseModel):
    category_id: Optional[uuid.UUID] = None
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    is_veg: Optional[bool] = None
    is_available: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    prep_time_minutes: Optional[int] = Field(None, ge=1)
    making_cost: Optional[float] = Field(None, ge=0)
    recipe: Optional[List[RecipeIngredient]] = None

class MenuItemResponse(BaseModel):
    id: uuid.UUID
    restaurant_id: uuid.UUID
    category_id: uuid.UUID
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    is_veg: bool
    is_available: bool
    is_bestseller: bool
    prep_time_minutes: Optional[int]
    making_cost: Optional[float] = 0
    recipe: Optional[List[RecipeIngredient]] = []
    modifiers: Optional[List[dict]] = []
    sort_order: int

# ==========================================
# Full Menu Response
# ==========================================
class MenuResponse(BaseModel):
    categories: List[CategoryResponse]
    items: List[MenuItemResponse]
