
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tags, ShoppingBag, AlertTriangle, PlusCircle, UserPlus, ListOrdered, CheckCircle } from 'lucide-react';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';

interface SummaryItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiringProducts, setExpiringProducts] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [products, categories] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        // Calculate expiring products (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiring = products.filter(product => 
          product.ExpiryDate <= thirtyDaysFromNow
        ).length;
        
        setExpiringProducts(expiring);
        
        // Create summary data
        const newSummaryData: SummaryItem[] = [
          {
            title: 'Total Products',
            value: products.length,
            icon: <Package className="h-8 w-8" />,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Categories',
            value: categories.length,
            icon: <Tags className="h-8 w-8" />,
            color: 'bg-green-500'
          },
          {
            title: 'Low Stock Items',
            value: products.filter(product => product.Quantity < 10).length,
            icon: <ShoppingBag className="h-8 w-8" />,
            color: 'bg-amber-500'
          },
          {
            title: 'Expiring Soon',
            value: expiring,
            icon: <AlertTriangle className="h-8 w-8" />,
            color: 'bg-red-500'
          }
        ];
        
        setSummaryData(newSummaryData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg h-6 bg-gray-200 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold h-8 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryData.map((item, index) => (
              <Card key={index} className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/products')}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className={`${item.color} text-white p-2 rounded-full`}>
                      {item.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/products/add')}
                  className="flex items-center justify-center p-4 bg-inventory-primary text-white rounded-md hover:bg-inventory-secondary transition-colors"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Product
                </button>
                <button
                  onClick={() => navigate('/categories/add')}
                  className="flex items-center justify-center p-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add New Category
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center justify-center p-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Package className="mr-2 h-5 w-5" />
                  View All Products
                </button>
                <button
                  onClick={() => navigate('/categories')}
                  className="flex items-center justify-center p-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ListOrdered className="mr-2 h-5 w-5" />
                  View All Categories
                </button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                {expiringProducts > 0 ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="font-medium text-red-800">Attention Required</p>
                        <p className="text-sm text-red-700">
                          {expiringProducts} {expiringProducts === 1 ? 'product is' : 'products are'} expiring soon.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          No products are expiring soon. Your inventory is in good shape!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Inventory Health</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className={`h-2.5 rounded-full ${expiringProducts > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.max(100 - (expiringProducts * 5), 10)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
