import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id?: string;
  name: string;
  ProductId: string;
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
    // Validate data
    if (productData.BatchDate >= productData.ExpiryDate) {
      throw new Error('Batch date must be before expiry date');
    }
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const batchDate = new Date(productData.BatchDate);
    batchDate.setHours(0, 0, 0, 0);
    
    if (batchDate < currentDate) {
      throw new Error('Batch date cannot be in the past');
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name: productData.name,
      ProductId: productData.ProductId,
      CategoryName: productData.CategoryName,
      Location: productData.Location,
      Quantity: productData.Quantity,
      BatchDate: Timestamp.fromDate(productData.BatchDate),
      ExpiryDate: Timestamp.fromDate(productData.ExpiryDate),
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
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        ProductId: data.ProductId,
        CategoryName: data.CategoryName,
        Location: data.Location,
        Quantity: data.Quantity,
        BatchDate: data.BatchDate.toDate(),
        ExpiryDate: data.ExpiryDate.toDate()
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
    // Validate dates if both are provided
    if (productData.BatchDate && productData.ExpiryDate) {
      if (productData.BatchDate >= productData.ExpiryDate) {
        throw new Error('Batch date must be before expiry date');
      }
      
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const batchDate = new Date(productData.BatchDate);
      batchDate.setHours(0, 0, 0, 0);
      
      if (batchDate < currentDate) {
        throw new Error('Batch date cannot be in the past');
      }
    }
    
    const productRef = doc(db, COLLECTION_NAME, id);
    
    // Convert Date objects to Firestore Timestamps
    const dataToUpdate: Record<string, any> = {};
    
    if (productData.name !== undefined) dataToUpdate.name = productData.name;
    if (productData.ProductId !== undefined) dataToUpdate.ProductId = productData.ProductId;
    if (productData.CategoryName !== undefined) dataToUpdate.CategoryName = productData.CategoryName;
    if (productData.Location !== undefined) dataToUpdate.Location = productData.Location;
    if (productData.Quantity !== undefined) dataToUpdate.Quantity = productData.Quantity;
    if (productData.BatchDate) dataToUpdate.BatchDate = Timestamp.fromDate(productData.BatchDate);
    if (productData.ExpiryDate) dataToUpdate.ExpiryDate = Timestamp.fromDate(productData.ExpiryDate);
    
    await updateDoc(productRef, dataToUpdate);
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