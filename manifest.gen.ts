// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$$$$$$$0 from "./actions/minicart/submit.ts";
import * as $$$$$$$$$1 from "./actions/wishlist/submit.ts";
import * as $$$$$$$$$$$0 from "./apps/deco/analytics.ts";
import * as $$$$$$$$$$$1 from "./apps/deco/htmx.ts";
import * as $$$$$$$$$$$2 from "./apps/deco/vtex.ts";
import * as $$$$$$$$$$$3 from "./apps/site.ts";
import * as $$$0 from "./loaders/availableIcons.ts";
import * as $$$1 from "./loaders/buyTogether.ts";
import * as $$$2 from "./loaders/geolocation.ts";
import * as $$$3 from "./loaders/icons.ts";
import * as $$$4 from "./loaders/minicart.ts";
import * as $$$5 from "./loaders/product/backgroundBanner.ts";
import * as $$$6 from "./loaders/product/rotativeText.ts";
import * as $$$7 from "./loaders/savedColors.ts";
import * as $$$8 from "./loaders/sizebay.ts";
import * as $$$9 from "./loaders/user.ts";
import * as $$$10 from "./loaders/vtexReviewsAndRatings/constants.ts";
import * as $$$11 from "./loaders/vtexReviewsAndRatings/index.ts";
import * as $$$12 from "./loaders/vtexReviewsAndRatings/queries.ts";
import * as $$$13 from "./loaders/vtexReviewsAndRatings/types.ts";
import * as $$$14 from "./loaders/wishlist.ts";
import * as $$$$$$0 from "./sections/Animation/Animation.tsx";
import * as $$$$$$1 from "./sections/BreadcrumbInstitucional/Breadcrumb.tsx";
import * as $$$$$$2 from "./sections/Category/CategoryBottomBanner.tsx";
import * as $$$$$$3 from "./sections/Category/CategoryGrid.tsx";
import * as $$$$$$4 from "./sections/Component.tsx";
import * as $$$$$$5 from "./sections/Content/FAQ.tsx";
import * as $$$$$$6 from "./sections/Content/Hero.tsx";
import * as $$$$$$7 from "./sections/Content/Intro.tsx";
import * as $$$$$$8 from "./sections/Content/Logos.tsx";
import * as $$$$$$9 from "./sections/Content/RotativeText.tsx";
import * as $$$$$$10 from "./sections/Footer/Footer.tsx";
import * as $$$$$$11 from "./sections/Header/Header.tsx";
import * as $$$$$$12 from "./sections/Images/BackgroundBanner.tsx";
import * as $$$$$$13 from "./sections/Images/Banner.tsx";
import * as $$$$$$14 from "./sections/Images/Carousel.tsx";
import * as $$$$$$15 from "./sections/Images/ImageGallery.tsx";
import * as $$$$$$16 from "./sections/Images/ShoppableBanner.tsx";
import * as $$$$$$17 from "./sections/Links/LinkTree.tsx";
import * as $$$$$$18 from "./sections/MenuInstitucional/MenuInstitucional.tsx";
import * as $$$$$$19 from "./sections/Miscellaneous/CampaignTimer.tsx";
import * as $$$$$$20 from "./sections/Miscellaneous/CookieConsent.tsx";
import * as $$$$$$21 from "./sections/Miscellaneous/Spacer.tsx";
import * as $$$$$$22 from "./sections/Newsletter/Newsletter.tsx";
import * as $$$$$$23 from "./sections/Policy/Policy.tsx";
import * as $$$$$$24 from "./sections/Product/ProductBuyTogether.tsx";
import * as $$$$$$25 from "./sections/Product/ProductDetails.tsx";
import * as $$$$$$26 from "./sections/Product/ProductReviews.tsx";
import * as $$$$$$27 from "./sections/Product/ProductShelf.tsx";
import * as $$$$$$28 from "./sections/Product/ProductShelfTabbed.tsx";
import * as $$$$$$29 from "./sections/Product/SearchResult.tsx";
import * as $$$$$$30 from "./sections/Product/ShelfWithImage.tsx";
import * as $$$$$$31 from "./sections/Product/Wishlist.tsx";
import * as $$$$$$32 from "./sections/Session.tsx";
import * as $$$$$$33 from "./sections/Social/InstagramPosts.tsx";
import * as $$$$$$34 from "./sections/Social/WhatsApp.tsx";
import * as $$$$$$35 from "./sections/Theme/Theme.tsx";

const manifest = {
  "loaders": {
    "site/loaders/availableIcons.ts": $$$0,
    "site/loaders/buyTogether.ts": $$$1,
    "site/loaders/geolocation.ts": $$$2,
    "site/loaders/icons.ts": $$$3,
    "site/loaders/minicart.ts": $$$4,
    "site/loaders/product/backgroundBanner.ts": $$$5,
    "site/loaders/product/rotativeText.ts": $$$6,
    "site/loaders/savedColors.ts": $$$7,
    "site/loaders/sizebay.ts": $$$8,
    "site/loaders/user.ts": $$$9,
    "site/loaders/vtexReviewsAndRatings/constants.ts": $$$10,
    "site/loaders/vtexReviewsAndRatings/index.ts": $$$11,
    "site/loaders/vtexReviewsAndRatings/queries.ts": $$$12,
    "site/loaders/vtexReviewsAndRatings/types.ts": $$$13,
    "site/loaders/wishlist.ts": $$$14,
  },
  "sections": {
    "site/sections/Animation/Animation.tsx": $$$$$$0,
    "site/sections/BreadcrumbInstitucional/Breadcrumb.tsx": $$$$$$1,
    "site/sections/Category/CategoryBottomBanner.tsx": $$$$$$2,
    "site/sections/Category/CategoryGrid.tsx": $$$$$$3,
    "site/sections/Component.tsx": $$$$$$4,
    "site/sections/Content/FAQ.tsx": $$$$$$5,
    "site/sections/Content/Hero.tsx": $$$$$$6,
    "site/sections/Content/Intro.tsx": $$$$$$7,
    "site/sections/Content/Logos.tsx": $$$$$$8,
    "site/sections/Content/RotativeText.tsx": $$$$$$9,
    "site/sections/Footer/Footer.tsx": $$$$$$10,
    "site/sections/Header/Header.tsx": $$$$$$11,
    "site/sections/Images/BackgroundBanner.tsx": $$$$$$12,
    "site/sections/Images/Banner.tsx": $$$$$$13,
    "site/sections/Images/Carousel.tsx": $$$$$$14,
    "site/sections/Images/ImageGallery.tsx": $$$$$$15,
    "site/sections/Images/ShoppableBanner.tsx": $$$$$$16,
    "site/sections/Links/LinkTree.tsx": $$$$$$17,
    "site/sections/MenuInstitucional/MenuInstitucional.tsx": $$$$$$18,
    "site/sections/Miscellaneous/CampaignTimer.tsx": $$$$$$19,
    "site/sections/Miscellaneous/CookieConsent.tsx": $$$$$$20,
    "site/sections/Miscellaneous/Spacer.tsx": $$$$$$21,
    "site/sections/Newsletter/Newsletter.tsx": $$$$$$22,
    "site/sections/Policy/Policy.tsx": $$$$$$23,
    "site/sections/Product/ProductBuyTogether.tsx": $$$$$$24,
    "site/sections/Product/ProductDetails.tsx": $$$$$$25,
    "site/sections/Product/ProductReviews.tsx": $$$$$$26,
    "site/sections/Product/ProductShelf.tsx": $$$$$$27,
    "site/sections/Product/ProductShelfTabbed.tsx": $$$$$$28,
    "site/sections/Product/SearchResult.tsx": $$$$$$29,
    "site/sections/Product/ShelfWithImage.tsx": $$$$$$30,
    "site/sections/Product/Wishlist.tsx": $$$$$$31,
    "site/sections/Session.tsx": $$$$$$32,
    "site/sections/Social/InstagramPosts.tsx": $$$$$$33,
    "site/sections/Social/WhatsApp.tsx": $$$$$$34,
    "site/sections/Theme/Theme.tsx": $$$$$$35,
  },
  "actions": {
    "site/actions/minicart/submit.ts": $$$$$$$$$0,
    "site/actions/wishlist/submit.ts": $$$$$$$$$1,
  },
  "apps": {
    "site/apps/deco/analytics.ts": $$$$$$$$$$$0,
    "site/apps/deco/htmx.ts": $$$$$$$$$$$1,
    "site/apps/deco/vtex.ts": $$$$$$$$$$$2,
    "site/apps/site.ts": $$$$$$$$$$$3,
  },
  "name": "site",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
