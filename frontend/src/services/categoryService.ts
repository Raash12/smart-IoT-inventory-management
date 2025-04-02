
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Category {
  id?: string;
  name: string;
  description: string;
}

const COLLECTION_NAME = 'categories';

// Create a new category
export const createCategory = async (categoryData: Omit<Category, 'id'>) => {
  try {
    // Check if category with same name exists
    const q = query(collection(db, COLLECTION_NAME), where('name', '==', categoryData.name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Category with this name already exists');
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryData);
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id'>>) => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(categoryRef, categoryData);
    return { id, ...categoryData };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
