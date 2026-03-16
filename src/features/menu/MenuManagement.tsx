// ==========================================
// PetPooja - Menu Management
// ==========================================

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit3, Trash2, X, Save, Upload,
    Image as ImageIcon, ChevronDown, Loader2, Check,
    UtensilsCrossed, Leaf, Flame, Clock, ToggleLeft, ToggleRight,
    AlertTriangle, FolderPlus, ChefHat, Scale, Droplet
} from 'lucide-react';
import { useMenuStore, useAuthStore, useInventoryStore } from '../../lib/store';
import { MenuItem, MenuCategory, RecipeIngredient, InventoryItem } from '../../types';
import { formatCurrency, classNames } from '../../lib/utils';

// ==========================================
// Item Card Component
// ==========================================
function MenuItemCard({
    item,
    category,
    onEdit,
}: {
    item: MenuItem;
    category?: MenuCategory;
    onEdit: (item: MenuItem) => void;
}) {
    return (
        <motion.div
            className="card"
            style={{
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                border: '1px solid var(--color-border)',
            }}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
            onClick={() => onEdit(item)}
            layout
        >
            {/* Image */}
            <div style={{
                height: '140px',
                background: item.image_url
                    ? `url(${item.image_url}) center/cover no-repeat`
                    : 'linear-gradient(135deg, var(--color-surface-elevated), var(--color-surface))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {!item.image_url && (
                    <UtensilsCrossed size={40} style={{ color: 'var(--color-text-tertiary)', opacity: 0.4 }} />
                )}

                {/* Veg/Non-Veg Badge */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${item.is_veg ? '#22C55E' : '#EF4444'}`,
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.is_veg ? '#22C55E' : '#EF4444',
                    }} />
                </div>

                {/* Status Badge */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    background: item.is_available ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                    color: item.is_available ? '#22C55E' : '#EF4444',
                    backdropFilter: 'blur(4px)',
                }}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                </div>

                {item.is_bestseller && (
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        background: 'rgba(245,158,11,0.2)',
                        color: '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <Flame size={10} /> Bestseller
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: 'var(--space-3)' }}>
                <div style={{
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {item.name}
                </div>
                {category && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
                        {category.icon} {category.name}
                    </div>
                )}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{
                        fontWeight: 700,
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-primary)',
                    }}>
                        {formatCurrency(item.price)}
                    </div>
                    {item.prep_time_minutes && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={10} /> {item.prep_time_minutes}m
                        </div>
                    )}
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                        MC: {formatCurrency(item.making_cost || 0)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ==========================================
// Recipe Modal Component
// ==========================================
const INGREDIENT_CATEGORIES = {
    'Fresh & Veggies': ['Onion', 'Tomato', 'Potato', 'Ginger', 'Garlic', 'Green chilli', 'Curry leaves', 'Coriander leaves'],
    'Dairy & Proteins': ['Paneer', 'Butter', 'Cream', 'Milk', 'Curd'],
    'Grains & Flour': ['Rice', 'Basmati rice', 'Wheat flour', 'Maida'],
    'Spices & Seasoning': ['Turmeric', 'Red chilli powder', 'Coriander powder', 'Cumin seeds', 'Garam masala', 'Mustard seeds', 'Salt', 'Oil']
};

const PREDEFINED_INGREDIENTS = Object.values(INGREDIENT_CATEGORIES).flat();

const UNIT_CATEGORIES = {
    'Weight': ['grams', 'kilogram', 'milligram'],
    'Volume': ['millilitre', 'litre', 'teaspoon', 'tablespoon'],
    'Count & Packaging': ['piece', 'single item', 'packaged item', 'bunch', 'bundle', 'leaf']
};

const UNITS = Object.values(UNIT_CATEGORIES).flat();

function RecipeModal({
    recipe,
    inventory,
    onSave,
    onClose
}: {
    recipe: RecipeIngredient[];
    inventory: InventoryItem[];
    onSave: (recipe: RecipeIngredient[]) => void;
    onClose: () => void;
}) {
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe);
    const [search, setSearch] = useState('');
    const [customIngredient, setCustomIngredient] = useState('');

    const addIngredient = async (itemOrName: InventoryItem | string) => {
        let targetItem: InventoryItem | undefined;

        if (typeof itemOrName === 'string') {
            const existing = inventory.find(i => i.name.toLowerCase() === itemOrName.toLowerCase());
            if (existing) {
                targetItem = existing;
            } else {
                // Auto-create missing ingredient
                setLoading(true);
                const { data, error } = await useInventoryStore.getState().addItem({
                    name: itemOrName,
                    category: 'Miscellaneous',
                    unit: 'grams',
                    current_stock: 0,
                    min_stock: 0,
                    cost_per_unit: 0
                });
                setLoading(false);
                if (error) {
                    alert(`Failed to create ingredient: ${error}`);
                    return;
                }
                targetItem = data;
            }
        } else {
            targetItem = itemOrName;
        }

        if (targetItem && !ingredients.some(existing => existing.ingredient_id === targetItem!.id)) {
            setIngredients([...ingredients, {
                id: '',
                ingredient_id: targetItem.id,
                ingredient_name: targetItem.name,
                quantity_required: 0,
                unit: targetItem.unit
            }]);
        }
        setSearch('');
    };

    const [modalLoading, setLoading] = useState(false);

    const filteredSuggestions = inventory.filter(
        i => i.name.toLowerCase().includes(search.toLowerCase()) &&
            !ingredients.some(existing => existing.ingredient_id === i.id)
    );

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
        const newIngs = [...ingredients];
        newIngs[index] = { ...newIngs[index], ...updates };
        setIngredients(newIngs);
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 1100, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}
        >
            <motion.div
                className="modal"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    maxWidth: '600px',
                    width: '95%',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden'
                }}
            >
                <div className="modal-header" style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(var(--color-primary-rgb), 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ChefHat size={22} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="modal-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recipe Configuration</h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>Define ingredients and quantities for accurate cost tracking</p>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
                    {/* Quick Add Section */}
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                            <FolderPlus size={14} className="text-secondary" />
                            Quick Add Ingredients
                        </label>
                        <div style={{
                            padding: 'var(--space-1)',
                            background: 'var(--color-bg)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                        }}>
                            {Object.entries(INGREDIENT_CATEGORIES).map(([category, items]) => (
                                <div key={category} style={{ marginBottom: 'var(--space-3)', padding: 'var(--space-2)' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', opacity: 0.8 }}>
                                        {category}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                        {items.map(ingName => {
                                            const invItem = inventory.find(i => i.name === ingName);
                                            const isAdded = ingredients.some(i => i.ingredient_name === ingName);
                                            return (
                                                <button
                                                    key={ingName}
                                                    onClick={() => addIngredient(invItem || ingName)}
                                                    disabled={modalLoading}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        background: isAdded ? 'var(--color-surface-elevated)' : 'var(--color-bg-hover)',
                                                        color: isAdded ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                                                        border: isAdded ? '1px solid var(--color-border)' : '1px solid transparent',
                                                        cursor: modalLoading ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        opacity: modalLoading ? 0.6 : 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    className={isAdded ? '' : 'hover-scale'}
                                                >
                                                    {isAdded ? <Check size={12} /> : modalLoading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                                    {ingName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search & Custom */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        <div className="input-group">
                            <label className="input-label">Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                <input
                                    className="input sm"
                                    placeholder="Find ingredient..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ paddingLeft: '34px' }}
                                />
                            </div>
                            {search && (
                                <div className="card" style={{
                                    marginTop: 'var(--space-1)',
                                    padding: 'var(--space-1)',
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    position: 'absolute',
                                    width: '100%',
                                    zIndex: 10,
                                    boxShadow: 'var(--shadow-lg)',
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    {filteredSuggestions.map((s: InventoryItem) => (
                                        <button
                                            key={s.id}
                                            className="btn btn-ghost btn-sm w-full"
                                            style={{ justifyContent: 'flex-start' }}
                                            onClick={() => addIngredient(s)}
                                        >
                                            <Plus size={14} style={{ marginRight: 'var(--space-2)' }} /> {s.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label">Custom Item</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    className="input sm"
                                    placeholder="Add new..."
                                    value={customIngredient}
                                    onChange={(e) => setCustomIngredient(e.target.value)}
                                />
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={!customIngredient.trim() || modalLoading}
                                    onClick={() => {
                                        addIngredient(customIngredient.trim());
                                        setCustomIngredient('');
                                    }}
                                >
                                    {modalLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ingredient List Title */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-3)',
                        paddingBottom: 'var(--space-2)',
                        borderBottom: '1px solid var(--color-border)'
                    }}>
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Check size={16} className="text-secondary" />
                            Modified Ingredients ({ingredients.length})
                        </h4>
                    </div>

                    {/* Ingredients List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {ingredients.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--space-12)',
                                background: 'rgba(var(--color-primary-rgb), 0.02)',
                                border: '1px dashed var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--color-text-tertiary)'
                            }}>
                                <ChefHat size={48} style={{ margin: '0 auto var(--space-3)', opacity: 0.2 }} />
                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>No ingredients defined yet</p>
                                <p style={{ fontSize: 'var(--text-xs)' }}>Click on common items or search to add them</p>
                            </div>
                        ) : (
                            ingredients.map((ing, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="card"
                                    style={{
                                        padding: 'var(--space-3)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto auto auto',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)',
                                        background: 'var(--color-bg)',
                                        border: '1px solid var(--color-border)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{ing.ingredient_name}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <Scale size={14} className="text-tertiary" />
                                        <input
                                            type="number"
                                            className="input sm"
                                            style={{ width: '80px', textAlign: 'center' }}
                                            value={ing.quantity_required || ''}
                                            placeholder="Qty"
                                            onChange={(e) => updateIngredient(idx, { quantity_required: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <Droplet size={14} className="text-tertiary" />
                                        <select
                                            className="input sm"
                                            style={{
                                                width: '120px',
                                                padding: '0 var(--space-2)',
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}
                                            value={ing.unit}
                                            onChange={(e) => updateIngredient(idx, { unit: e.target.value })}
                                        >
                                            {Object.entries(UNIT_CATEGORIES).map(([cat, units]) => (
                                                <optgroup key={cat} label={cat} style={{ fontStyle: 'normal', fontWeight: 600 }}>
                                                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>

                                    <button className="btn btn-ghost btn-icon sm" onClick={() => removeIngredient(idx)} style={{ color: 'var(--color-error)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div className="modal-footer" style={{ padding: 'var(--space-5) var(--space-6)', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>
                        <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Changes will be saved to this menu item upon clicking "Update"
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button className="btn btn-secondary" onClick={onClose} style={{ minWidth: '100px' }}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => onSave(ingredients)} style={{ minWidth: '120px' }}>
                            <Save size={16} /> Save Recipe
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
function ItemFormPanel({
    item,
    categories,
    onClose,
    onSave,
    onDelete,
    saving,
}: {
    item: MenuItem | null;
    categories: MenuCategory[];
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    saving: boolean;
}) {
    const { uploadItemImage } = useMenuStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(item?.name || '');
    const [categoryId, setCategoryId] = useState(item?.category_id || (categories[0]?.id || ''));
    const [price, setPrice] = useState(item?.price?.toString() || '');
    const [description, setDescription] = useState(item?.description || '');
    const [isVeg, setIsVeg] = useState(item?.is_veg ?? true);
    const [isBestseller, setIsBestseller] = useState(item?.is_bestseller ?? false);
    const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
    const [prepTime, setPrepTime] = useState(item?.prep_time_minutes?.toString() || '15');
    const [imageUrl, setImageUrl] = useState(item?.image_url || '');
    const [makingCost, setMakingCost] = useState(item?.making_cost?.toString() || '0');
    const [recipe, setRecipe] = useState<RecipeIngredient[]>(() => {
        if (!item?.recipe) return [];
        const ings = Array.isArray(item.recipe) ? item.recipe : (item.recipe as any).ingredients;
        if (!Array.isArray(ings)) return [];
        return ings.map(ing => ({
            ...ing,
            ingredient_name: ing.ingredient_name || (ing as any).name || 'Unknown Ingredient',
            quantity_required: ing.quantity_required ?? (ing as any).quantity ?? 0
        }));
    });

    const { fetchRecipe } = useMenuStore();

    useEffect(() => {
        if (item?.id) {
            const loadRecipe = async () => {
                const r = await fetchRecipe(item.id);
                if (r?.ingredients && r.ingredients.length > 0) {
                    setRecipe(r.ingredients.map(ing => ({
                        ...ing,
                        ingredient_name: ing.ingredient_name || (ing as any).name || 'Unknown Ingredient',
                        quantity_required: ing.quantity_required ?? (ing as any).quantity ?? 0
                    })));
                }
            };
            loadRecipe();
        }
    }, [item?.id, fetchRecipe]);
    const [imagePreview, setImagePreview] = useState(item?.image_url || '');
    const [uploading, setUploading] = useState(false);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatIcon, setNewCatIcon] = useState('🍽️');

    const isEditing = !!item;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = 'Item name is required';
        if (!categoryId) errs.category = 'Select a category';
        if (!price || parseFloat(price) <= 0) errs.price = 'Valid price is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        setUploading(true);
        const { url, error } = await uploadItemImage(file);
        setUploading(false);

        if (url) {
            setImageUrl(url);
        } else {
            alert('Image upload failed: ' + (error || 'Unknown error'));
        }
    };

    const handleSave = async () => {
        if (!validate()) return;
        await onSave({
            name: name.trim(),
            category_id: categoryId,
            price: parseFloat(price),
            description: description.trim() || null,
            is_veg: isVeg,
            is_bestseller: isBestseller,
            is_available: isAvailable,
            prep_time_minutes: parseInt(prepTime) || 15,
            making_cost: parseFloat(makingCost) || 0,
            recipe: recipe,
            image_url: imageUrl || null,
        });
    };

    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        const { addCategory } = useMenuStore.getState();
        const { data, error } = await addCategory(newCatName.trim(), newCatIcon);
        if (data) {
            setCategoryId(data.id);
            setShowNewCategory(false);
            setNewCatName('');
        } else {
            alert('Failed to add category: ' + error);
        }
    };

    return (
        <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            style={{
                width: '380px',
                minWidth: '380px',
                height: '100%',
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600 }}>
                    {isEditing ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button className="btn btn-ghost btn-icon sm" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            {/* Form Body */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
            }}>
                {/* Image Upload */}
                <div>
                    <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Item Image</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            height: '160px',
                            borderRadius: 'var(--radius-lg)',
                            border: '2px dashed var(--color-border)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            background: imagePreview
                                ? `url(${imagePreview}) center/cover no-repeat`
                                : 'var(--color-surface-elevated)',
                            transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                    >
                        {uploading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Uploading...</span>
                            </div>
                        ) : !imagePreview ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Upload size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Click to upload image</span>
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-xs)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <Edit3 size={10} /> Change
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Item Name */}
                <div className="input-group">
                    <label className="input-label">Item Name *</label>
                    <input
                        className={classNames('input', errors.name && 'input-error')}
                        placeholder="e.g. Butter Chicken"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                    />
                    {errors.name && <div className="input-error-message">{errors.name}</div>}
                </div>

                {/* Category */}
                <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Category *
                        <button
                            onClick={() => setShowNewCategory(!showNewCategory)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontSize: 'var(--text-xs)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: 0,
                            }}
                        >
                            <FolderPlus size={12} /> New
                        </button>
                    </label>

                    {showNewCategory && (
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-2)',
                            padding: 'var(--space-2)',
                            background: 'var(--color-surface-elevated)',
                            borderRadius: 'var(--radius-md)',
                        }}>
                            <input
                                className="input"
                                placeholder="Icon"
                                value={newCatIcon}
                                onChange={(e) => setNewCatIcon(e.target.value)}
                                style={{ width: '50px', textAlign: 'center' }}
                            />
                            <input
                                className="input"
                                placeholder="Category name"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-primary btn-sm" onClick={handleAddCategory}>
                                <Check size={14} />
                            </button>
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <select
                            className={classNames('input', errors.category && 'input-error')}
                            value={categoryId}
                            onChange={(e) => { setCategoryId(e.target.value); setErrors((p) => ({ ...p, category: '' })); }}
                            style={{ appearance: 'none', paddingRight: '32px' }}
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-tertiary)' }} />
                    </div>
                    {errors.category && <div className="input-error-message">{errors.category}</div>}
                </div>

                {/* Price */}
                <div className="input-group">
                    <label className="input-label">Price (₹) *</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                        }}>₹</span>
                        <input
                            className={classNames('input', errors.price && 'input-error')}
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: '' })); }}
                            style={{ paddingLeft: '32px' }}
                            min="0"
                            step="1"
                        />
                    </div>
                    {errors.price && <div className="input-error-message">{errors.price}</div>}
                </div>
                {/* Making Cost & Recipe */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="input-group">
                        <label className="input-label">Making Cost (₹)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--text-sm)',
                            }}>₹</span>
                            <input
                                className="input"
                                type="number"
                                placeholder="0"
                                value={makingCost}
                                onChange={(e) => setMakingCost(e.target.value)}
                                style={{ paddingLeft: '32px' }}
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Item Recipe</label>
                        <button
                            className="btn btn-secondary w-full"
                            style={{
                                height: '42px',
                                gap: 'var(--space-2)',
                                border: recipe.length > 0 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                color: recipe.length > 0 ? 'var(--color-primary)' : 'inherit',
                                background: recipe.length > 0 ? 'rgba(var(--color-primary-rgb), 0.05)' : 'transparent'
                            }}
                            onClick={() => setShowRecipeModal(true)}
                        >
                            <ChefHat size={16} />
                            {recipe.length > 0 ? `${recipe.length} Ingredients` : 'Add Recipe'}
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="input-group">
                    <label className="input-label">Description</label>
                    <textarea
                        className="input"
                        placeholder="Short description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                {/* Prep Time */}
                <div className="input-group">
                    <label className="input-label">Prep Time (minutes)</label>
                    <input
                        className="input"
                        type="number"
                        placeholder="15"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        min="1"
                    />
                </div>

                {/* Toggles Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-3)',
                }}>
                    {/* Veg/Non-Veg */}
                    <div
                        onClick={() => setIsVeg(!isVeg)}
                        style={{
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isVeg ? '#22C55E' : '#EF4444'}`,
                            background: isVeg ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Leaf size={16} style={{ color: isVeg ? '#22C55E' : '#EF4444' }} />
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </div>

                    {/* Bestseller */}
                    <div
                        onClick={() => setIsBestseller(!isBestseller)}
                        style={{
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isBestseller ? '#F59E0B' : 'var(--color-border)'}`,
                            background: isBestseller ? 'rgba(245,158,11,0.08)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Flame size={16} style={{ color: isBestseller ? '#F59E0B' : 'var(--color-text-tertiary)' }} />
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Bestseller</span>
                    </div>
                </div>

                {/* Available Toggle */}
                <div
                    onClick={() => setIsAvailable(!isAvailable)}
                    style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${isAvailable ? '#22C55E' : 'var(--color-border)'}`,
                        background: isAvailable ? 'rgba(34,197,94,0.08)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        {isAvailable ? '✅ Available for ordering' : '❌ Currently unavailable'}
                    </span>
                    {isAvailable ? <ToggleRight size={22} style={{ color: '#22C55E' }} /> : <ToggleLeft size={22} style={{ color: 'var(--color-text-tertiary)' }} />}
                </div>
            </div>

            {/* Footer Buttons */}
            <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                gap: 'var(--space-3)',
            }}>
                {isEditing && (
                    <>
                        {showDeleteConfirm ? (
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                                <button
                                    className="btn btn-error btn-sm"
                                    style={{ flex: 1 }}
                                    onClick={async () => {
                                        if (onDelete && item) {
                                            await onDelete(item.id);
                                        }
                                    }}
                                >
                                    <AlertTriangle size={14} /> Confirm Delete
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-ghost"
                                style={{ color: 'var(--color-error)' }}
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        )}
                    </>
                )}
                <div style={{ flex: 1 }} />
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || uploading}
                >
                    {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                    {' '}{isEditing ? 'Update' : 'Add Item'}
                </button>
            </div>
            {/* Modal Overlay for Recipe */}
            <AnimatePresence>
                {showRecipeModal && (
                    <RecipeModal
                        recipe={recipe}
                        inventory={useInventoryStore.getState().inventory}
                        onClose={() => setShowRecipeModal(false)}
                        onSave={(newRecipe) => {
                            setRecipe(newRecipe);
                            setShowRecipeModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ==========================================
// Main Menu Management Page
// ==========================================
export default function MenuManagement() {
    const {
        categories, items, loading: menuLoading, saving,
        fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem, saveRecipe
    } = useMenuStore();

    const { inventory, loading: invLoading, fetchInventory } = useInventoryStore();

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [showPanel, setShowPanel] = useState(false);
    const [isNewItem, setIsNewItem] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const loading = menuLoading || invLoading;

    useEffect(() => {
        fetchMenu();
        fetchInventory();
    }, []);

    useEffect(() => {
        fetchMenu();
        fetchInventory();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const filteredItems = useMemo(() => {
        let result = items;
        if (filterCategory !== 'all') {
            result = result.filter((i) => i.category_id === filterCategory);
        }
        if (filterStatus === 'available') {
            result = result.filter((i) => i.is_available);
        } else if (filterStatus === 'unavailable') {
            result = result.filter((i) => !i.is_available);
        }
        if (search) {
            const s = search.toLowerCase();
            result = result.filter((i) => i.name.toLowerCase().includes(s));
        }
        return result;
    }, [items, filterCategory, filterStatus, search]);

    const getCategoryById = (id: string) => categories.find((c) => c.id === id);

    const handleEdit = (item: MenuItem) => {
        setSelectedItem(item);
        setIsNewItem(false);
        setShowPanel(true);
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        setIsNewItem(true);
        setShowPanel(true);
    };

    const handleClosePanel = () => {
        setShowPanel(false);
        setSelectedItem(null);
        setIsNewItem(false);
    };

    const handleSave = async (data: any) => {
        let result;
        const recipeData = data.recipe;
        delete data.recipe;

        if (isNewItem) {
            result = await addMenuItem(data);
            if (!result.error && result.data?.id && recipeData?.length > 0) {
                await saveRecipe({ menu_item_id: result.data.id, ingredients: recipeData });
            }
        } else if (selectedItem) {
            result = await updateMenuItem(selectedItem.id, data);
            if (!result.error && recipeData) {
                await saveRecipe({ menu_item_id: selectedItem.id, ingredients: recipeData });
            }
        }
        if (result?.error) {
            setToast({ message: `Failed: ${result.error}`, type: 'error' });
        } else {
            setToast({ message: isNewItem ? 'Item added successfully!' : 'Item updated successfully!', type: 'success' });
            handleClosePanel();
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteMenuItem(id);
        if (result?.error) {
            setToast({ message: `Delete failed: ${result.error}`, type: 'error' });
        } else {
            setToast({ message: 'Item deleted successfully!', type: 'success' });
            handleClosePanel();
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Edit/Add Panel */}
            <AnimatePresence>
                {showPanel && (
                    <ItemFormPanel
                        key={selectedItem?.id || 'new'}
                        item={isNewItem ? null : selectedItem}
                        categories={categories}
                        onClose={handleClosePanel}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div className="page-container" style={{ flex: 1 }}>
                    {/* Header */}
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <h1 className="page-title">Menu Management</h1>
                            <p className="page-subtitle">{items.length} items across {categories.length} categories</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddNew}>
                            <Plus size={16} /> Add New Item
                        </button>
                    </div>

                    {/* Filters & Search */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-6)',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                            <input
                                className="input"
                                placeholder="Search items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>

                        {/* Category Filter */}
                        <div style={{ position: 'relative' }}>
                            <select
                                className="input"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                style={{ appearance: 'none', paddingRight: '32px', minWidth: '160px' }}
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-tertiary)' }} />
                        </div>

                        {/* Status Filter */}
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                            {[
                                { label: 'All', value: 'all' },
                                { label: 'Available', value: 'available' },
                                { label: 'Unavailable', value: 'unavailable' },
                            ].map((f) => (
                                <button
                                    key={f.value}
                                    className={classNames('billing-category-btn', filterStatus === f.value && 'active')}
                                    onClick={() => setFilterStatus(f.value)}
                                    style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Items Grid */}
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)' }}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                            <UtensilsCrossed size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--space-4)', opacity: 0.4 }} />
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                {items.length === 0 ? 'No menu items yet' : 'No items match your filters'}
                            </div>
                            <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                                {items.length === 0 ? 'Start by adding your first menu item' : 'Try adjusting your search or filter criteria'}
                            </div>
                            {items.length === 0 && (
                                <button className="btn btn-primary" onClick={handleAddNew}>
                                    <Plus size={16} /> Add First Item
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 'var(--space-4)',
                        }}>
                            {filteredItems.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    category={getCategoryById(item.category_id)}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            padding: 'var(--space-3) var(--space-5)',
                            borderRadius: 'var(--radius-lg)',
                            background: toast.type === 'success' ? '#22C55E' : '#EF4444',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: 'var(--text-sm)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}
                    >
                        {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
