import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, AlertTriangle, RefreshCw } from 'lucide-react';
import { getProducts, Product } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    expiringProducts: 0,
    categoryCount: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        
        setProducts(productsData);
        
        // Calculate stats
        const lowStockCount = productsData.filter(p => p.Quantity < 10).length;
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiringCount = productsData.filter(p => p.ExpiryDate <= thirtyDaysFromNow).length;
        
        setStats({
          totalProducts: productsData.length,
          lowStockProducts: lowStockCount,
          expiringProducts: expiringCount,
          categoryCount: categoriesData.length,
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const refreshData = async () => {
    try {
      setLoading(true);
      toast({
        title: 'Refreshing',
        description: 'Updating dashboard data...',
      });
      
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      
      setProducts(productsData);
      
      // Calculate stats
      const lowStockCount = productsData.filter(p => p.Quantity < 10).length;
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringCount = productsData.filter(p => p.ExpiryDate <= thirtyDaysFromNow).length;
      
      setStats({
        totalProducts: productsData.length,
        lowStockProducts: lowStockCount,
        expiringProducts: expiringCount,
        categoryCount: categoriesData.length,
      });
      
      toast({
        title: 'Success',
        description: 'Dashboard data updated successfully.',
      });
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Products in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoryCount}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Product categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Products with quantity &lt; 10
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringProducts}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Products expiring in 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your inventory</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button 
              className="w-full justify-start" 
              onClick={() => navigate('/products/add')}
            >
              <Package className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
            <Button 
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/products')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              View All Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {stats.lowStockProducts === 0 && stats.expiringProducts === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No alerts at this time</p>
              </div>
            ) : (
              <div>
                {stats.lowStockProducts > 0 && (
                  <div className="px-6 py-3 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      <span>{stats.lowStockProducts} products with low stock</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/products')}
                    >
                      View
                    </Button>
                  </div>
                )}
                
                {stats.expiringProducts > 0 && (
                  <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      <span>{stats.expiringProducts} products expiring soon</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/products')}
                    >
                      View
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;