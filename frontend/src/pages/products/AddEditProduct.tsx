import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { createProduct, updateProduct, getProducts, Product } from '@/services/productService';
import { getCategories, Category } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  ProductId: z.string().min(1, { message: 'Product ID is required' }),
  CategoryName: z.string().min(1, { message: 'Category is required' }),
  Location: z.string().min(1, { message: 'Location is required' }),
  Quantity: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' }),
  BatchDate: z.date(),
  ExpiryDate: z.date(),
}).refine(data => data.BatchDate < data.ExpiryDate, {
  message: 'Batch date must be before expiry date',
  path: ['ExpiryDate'],
});

type FormValues = z.infer<typeof formSchema>;

const AddEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(id ? true : false);
  
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ProductId: '',
      CategoryName: '',
      Location: '',
      Quantity: 0,
      BatchDate: new Date(),
      ExpiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setFetchingData(true);
          const products = await getProducts();
          const product = products.find(p => p.id === id);
          
          if (product) {
            form.reset({
              name: product.name,
              ProductId: product.ProductId,
              CategoryName: product.CategoryName,
              Location: product.Location,
              Quantity: product.Quantity,
              BatchDate: new Date(product.BatchDate),
              ExpiryDate: new Date(product.ExpiryDate),
            });
          } else {
            toast({
              title: 'Error',
              description: 'Product not found',
              variant: 'destructive',
            });
            navigate('/products');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product data',
            variant: 'destructive',
          });
        } finally {
          setFetchingData(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode, navigate, form, toast]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      if (isEditMode && id) {
        await updateProduct(id, {
          name: data.name,
          ProductId: data.ProductId,
          CategoryName: data.CategoryName,
          Location: data.Location,
          Quantity: data.Quantity,
          BatchDate: data.BatchDate,
          ExpiryDate: data.ExpiryDate
        });
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await createProduct({
          name: data.name,
          ProductId: data.ProductId,
          CategoryName: data.CategoryName,
          Location: data.Location,
          Quantity: data.Quantity,
          BatchDate: data.BatchDate,
          ExpiryDate: data.ExpiryDate
        });
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      
      navigate('/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inventory-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update Product Information' : 'Product Information'}</CardTitle>
          <CardDescription>
            Fill in the details of the product you want to {isEditMode ? 'update' : 'add'} to your inventory.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="CategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter storage location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="Quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Enter quantity" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="BatchDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Batch Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ExpiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/products')}
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
                  isEditMode ? 'Update Product' : 'Add Product'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddEditProduct;
