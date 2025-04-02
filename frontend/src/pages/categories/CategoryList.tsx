
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tags, Search, Plus, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Category, getCategories, deleteCategory } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete);
      setCategories(categories.filter(category => category.id !== categoryToDelete));
      toast({
        title: 'Success',
        description: 'Category deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category.',
        variant: 'destructive',
      });
    } finally {
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => navigate('/categories/add')} className="bg-inventory-primary hover:bg-inventory-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-md border p-8 grid place-items-center">
          <div className="flex flex-col items-center space-y-2">
            <Tags className="h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-md border p-8 grid place-items-center">
          <div className="flex flex-col items-center space-y-2">
            <Tags className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No categories found</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/categories/add')}
            >
              Add category
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/categories/edit/${category.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCategoryToDelete(category.id || '')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and may affect products that use this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
