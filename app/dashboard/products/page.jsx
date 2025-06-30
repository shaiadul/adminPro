"use client";
import ProductTable from "@/components/dashboard/productpage/ProductTable";
import PageHead from "@/components/global/pageHead/PageHead";
import Skeleton from "@/components/global/skeleton/Skeleton";
import { fetchProducts } from "@/redux/slice/productsSlice";
import { fetchOutlets } from "@/redux/slice/outletSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const product = useSelector((state) => state?.products);
  const outlets = useSelector((state) => state?.outlets?.outlets?.outlet);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOutlets());
  }, [dispatch]);

  const productsList = Array.isArray(product?.products?.data) ? product.products.data : [];
  const AllProducts = [...productsList].reverse();

  const AllOutlets = outlets || [];

  const data_product = AllProducts || [];
  const data_outlets = AllOutlets || [];

  console.log("Product Data:", product?.products?.data);

  return (
    <main>
      {data_product.length === 0 ? (
        <Skeleton />
      ) : (
        <div>
          <PageHead pageHead="Events" />
          <ProductTable AllProducts={AllProducts} AllOutlets={AllOutlets} />
        </div>
      )}
    </main>
  );
}
