// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import 'leaflet/dist/leaflet.css';
import { FiExternalLink, FiBarChart2, FiUsers, FiLink, FiClock, FiGlobe, FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi';
import { FaChrome, FaFirefox, FaSafari, FaEdge } from 'react-icons/fa';



export default function Admin() {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [timeData, setTimeData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch links with click counts
    const { data: linksData } = await supabase.from('links').select('*, clicks(count)');
      console.log("Links:", linksData);
      setLinks(linksData || []);

      const { data: statsData } = await supabase.rpc('get_link_stats');
      console.log("Stats:", statsData);
      setStats(statsData?.[0] || { total_links: 0, total_clicks: 0 });

      const { data: timeSeriesData } = await supabase.rpc('get_clicks_by_time');
      console.log("Time Data:", timeSeriesData);
      setTimeData(timeSeriesData || []);

      const { data: countryData } = await supabase.rpc('get_country_stats');
      console.log("Country:", countryData);
      setCountryData(countryData || []);

      const { data: deviceData } = await supabase.rpc('get_device_stats');
      console.log("Devices:", deviceData);
      setDeviceData(deviceData || []);

      const { data: browserData } = await supabase.rpc('get_browser_stats');
      console.log("Browsers:", browserData);
      setBrowserData(browserData || []);
    };

    fetchAllData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLinks = [...links].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getBrowserIcon = (browser) => {
    switch(browser.toLowerCase()) {
      case 'chrome': return <FaChrome className="inline mr-2 text-blue-500" />;
      case 'firefox': return <FaFirefox className="inline mr-2 text-orange-500" />;
      case 'safari': return <FaSafari className="inline mr-2 text-blue-400" />;
      case 'edge': return <FaEdge className="inline mr-2 text-blue-600" />;
      default: return <FaChrome className="inline mr-2 text-gray-500" />;
    }
  };

  const getDeviceIcon = (device) => {
    switch(device.toLowerCase()) {
      case 'mobile': return <FiSmartphone className="inline mr-2" />;
      case 'tablet': return <FiTablet className="inline mr-2" />;
      case 'desktop': return <FiMonitor className="inline mr-2" />;
      default: return <FiSmartphone className="inline mr-2" />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Link Analytics Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} mr-4`}>
                <FiLink className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Links</p>
                <p className="text-2xl font-bold">{stats?.total_links || 0}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'} mr-4`}>
                <FiBarChart2 className={`text-2xl ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Clicks</p>
                <p className="text-2xl font-bold">{stats?.total_clicks || 0}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
                <FiUsers className={`text-2xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Countries</p>
                <p className="text-2xl font-bold">{countryData?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} mr-4`}>
                <FiClock className={`text-2xl ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Clicks/Day</p>
                <p className="text-2xl font-bold">
                  {stats?.total_clicks && links.length ? Math.round(stats.total_clicks / links.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Click Trend (Last 30 Days)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : {}} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={countryData.slice(0, 5)}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    type="number" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis 
                    dataKey="country" 
                    type="category" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : {}} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Device Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="device_type"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : {}} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              {deviceData.map((device, index) => (
                <div key={device.device_type} className="flex items-center mb-2">
                  {getDeviceIcon(device.device_type)}
                  <span className="mr-2">{device.device_type}:</span>
                  <span className="font-semibold">{device.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Browser Usage</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="browser"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={darkMode ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6'
                    } : {}} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              {browserData.map((browser, index) => (
                <div key={browser.browser} className="flex items-center mb-2">
                  {getBrowserIcon(browser.browser)}
                  <span className="mr-2">{browser.browser}:</span>
                  <span className="font-semibold">{browser.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
         <div className={`p-6 rounded-xl shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">All Links</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th 
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort('short_code')}
                  >
                    Short Code {sortConfig.key === 'short_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort('original_url')}
                  >
                    Original URL {sortConfig.key === 'original_url' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort('click_count')}
                  >
                    Clicks {sortConfig.key === 'click_count' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-3 text-left cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Created At {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLinks.map((link) => (
                  <tr 
                    key={link.id} 
                    className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="p-3">
                      <a 
                        href={`/${link.short_code}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-400'}`}
                      >
                        {link.short_code} <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                    <td className="p-3 truncate max-w-xs">
                      <a 
                        href={link.original_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-400'}`}
                      >
                        {link.original_url}
                      </a>
                    </td>
                    <td className="p-3">{link.click_count}</td>
                    <td className="p-3">{new Date(link.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}