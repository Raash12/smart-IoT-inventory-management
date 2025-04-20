import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id?: string;
  name: string;
  CategoryName: string;
  Location: string;
  Quantity: number;
  BatchDate: Date;
  ExpiryDate: Date;
}

const COLLECTION_NAME = 'products';

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>) => {
  try {
    if (productData.BatchDate >= productData.ExpiryDate) {
      throw new Error('Batch date must be before expiry date');
    }
    if (productData.BatchDate < new Date()) {
      throw new Error('Batch date cannot be in the past');
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      BatchDate: productData.BatchDate,
      ExpiryDate: productData.ExpiryDate,
    });

    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get all products or filter by category
export const getProducts = async (categoryName?: string): Promise<Product[]> => {
  try {
    let q;
    if (categoryName) {
      q = query(collection(db, COLLECTION_NAME), where('CategoryName', '==', categoryName));
    } else {
      q = collection(db, COLLECTION_NAME);
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Record<string, any>;
      return {
        id: doc.id,
        ...data,
        BatchDate: data.BatchDate.toDate(),
        ExpiryDate: data.ExpiryDate.toDate(),
      } as Product;
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id'>>) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, productData);
    return { id, ...productData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
