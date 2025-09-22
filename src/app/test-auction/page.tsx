'use client';

import Link from 'next/link';

export default function TestAuctionPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Auction Pages Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Auction Pages Links</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Auction Apply Page</h3>
            <Link href="/auction/apply" className="text-blue-600 hover:text-blue-800 underline">
              Go to Auction Apply Page
            </Link>
          </div>
          
          <div>
            <h3 className="font-medium">Auction Status Page</h3>
            <Link href="/auction/status" className="text-blue-600 hover:text-blue-800 underline">
              Go to Auction Status Page
            </Link>
          </div>
          
          <div>
            <h3 className="font-medium">Auction Listings Page</h3>
            <Link href="/auction/listings" className="text-blue-600 hover:text-blue-800 underline">
              Go to Auction Listings Page
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <p className="mb-4">
          If you're still seeing 404 errors, try these steps:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Refresh the page</li>
          <li>Clear your browser cache</li>
          <li>Make sure the development server is running on port 3003</li>
          <li>Check that test data has been seeded in the database</li>
        </ul>
      </div>
    </div>
  );
}