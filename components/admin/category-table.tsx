"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ETrikeLoader from "@/components/ui/etrike-loader";
import type { ProductData } from "@/lib/api";

interface ProductTableProps {
  products: ProductData[];
  loading: boolean;
  onEdit: (product: ProductData) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleView = (product: ProductData) => {
    console.log("=== DEBUGGING VIEW CLICK ===");
    console.log("Product object:", product);
    console.log("Product ID:", product.id);
    console.log("Navigating to:", `/admin/products/${product.id}`);

    if (!product.id) {
      console.error("Product ID is missing!");
      alert("Product ID is missing!");
      return;
    }

    router.push(`/admin/products/${product.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <ETrikeLoader />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Category Found
        </h3>
        <p className="text-gray-600">Start by adding your first category.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header with Items Per Page Selector */}
      <div className="px-6 py-4 rounded border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-90">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category</h3>
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of{" "}
            {products.length} category
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-70 border-b border-blue-100 justify-between items-center">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900"></th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Brand
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 ">
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-orange-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex justify-ceter items-center space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={
                          product.images?.[0] ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {product.model}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                      {product.category}
                    </Badge>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => product.id && onDelete(product.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <Button
                      variant={1 === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 p-0"
                    >
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* Current page and surrounding pages */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === currentPage ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <Button
                      variant={
                        totalPages === currentPage ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
