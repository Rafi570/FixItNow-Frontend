import Banner from "@/src/components/home/Banner";
import CategorySection from "@/src/components/home/CategorySection";
import PopularServices from "@/src/components/home/PopularServices";
import Faq from "@/src/components/home/Faq";
import { getServicesAction } from "@/src/actions/service.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import React from "react";

export default async function page() {
  const [servicesRes, meRes] = await Promise.all([
    getServicesAction(),
    getMeAction(),
  ]);

  const services = servicesRes?.success ? servicesRes.data : [];
  const isLoggedIn = meRes?.success || false;
  const currentUser = meRes?.success ? meRes.data : null;

  return (
    <div>
      <Banner />
      <CategorySection />
      <PopularServices
        services={services}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      <Faq />
    </div>
  );
}
