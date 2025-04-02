import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createCategory, updateCategory, getCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const AddEditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(id ? true : false);
  
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setFetchingData(true);
          // For demo, we'll simulate fetching category data since we don't have an API for individual category
          // In a real app, you would fetch from the API
          const categories = await getCategories();
          const category = categories.find(c => c.id === id);
          
          if (category) {
            form.reset({
              name: category.name,
              description: category.description,
            });
          } else {
            toast({
              title: 'Error',
              description: 'Category not found',
              variant: 'destructive',
            });
            navigate('/categories');
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          toast({
            title: 'Error',
            description: 'Failed to load category data',
            variant: 'destructive',
          });
        } finally {
          setFetchingData(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditMode, navigate, form, toast]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      if (isEditMode && id) {
        await updateCategory(id, {
          name: data.name,
          description: data.description
        });
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await createCategory({
          name: data.name,
          description: data.description
        });
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      
      navigate('/categories');
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inventory-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update Category Information' : 'Category Information'}</CardTitle>
          <CardDescription>
            Fill in the details of the category you want to {isEditMode ? 'update' : 'add'} to your inventory system.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter category description" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/categories')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-inventory-primary hover:bg-inventory-secondary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">
                      {isEditMode ? 'Updating...' : 'Saving...'}
                    </span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </>
                ) : (
                  isEditMode ? 'Update Category' : 'Add Category'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddEditCategory;
