import React from "react";
import Predictive from "pages/predictive";
import Freight from "pages/freight";
import {
  INDEX_PAGE_ROUTE,
  PREDICTIVE_PAGE_ROUTE,
  FREIGHT_PAGE_ROUTE,
} from "routes/route-path";

// PAGES
import { IndexPage } from "pages";

export const PAGE_ROUTES = [
  {
    id: "home",
    path: INDEX_PAGE_ROUTE,
    element: <IndexPage />, // Ensure you import Home at the top
    isPrivate: false, // Adjust as needed
    deactivate: false,
  },
  {
    id: "another",
    path: PREDICTIVE_PAGE_ROUTE, // Use the new constant here
    element: <Predictive />, // Reference your new page component
    isPrivate: false, // Set to true if the page should be private
    deactivate: false,
  },
  {
    id: "freight",
    path: FREIGHT_PAGE_ROUTE, // Use the new constant here
    element: <Freight />, // Reference your new page component
    isPrivate: false, // Set to true if the page should be private
    deactivate: false,
  },
  // Other routes...
];
