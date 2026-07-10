const assert = require("node:assert/strict");
const test = require("node:test");

const {
  addToCart,
  cartReducer,
  decreaseCartItem,
  hydrateCart,
  removeFromCart,
  restoreCartItem,
} = require("../.test-build/src/entities/product/model/cart-slice.js");
const {
  addToFavorites,
  favoritesReducer,
  removeFromFavorites,
} = require("../.test-build/src/entities/product/model/favorites-slice.js");
const {
  selectCartItemQuantity,
  selectCartProductIds,
  selectCartTotalCount,
  selectFavoritesCount,
  selectIsProductFavorite,
  selectIsProductInCart,
} = require("../.test-build/src/entities/product/model/selectors.js");
const {
  ALL_CATALOG_FILTER_VALUE,
  filterAndSortProducts,
  getCatalogCategories,
  getCatalogPage,
  getCatalogProductTypes,
  getProductCategory,
  getProductType,
} = require("../.test-build/src/entities/product/lib/catalog.js");

function makeProduct(overrides) {
  return {
    available: true,
    characteristics: [],
    id: 1,
    labels: {},
    name: "Карабин тестовый",
    price: 1000,
    price_discount: 900,
    quantity: 1,
    reviews: 0,
    ...overrides,
  };
}

const products = [
  makeProduct({
    id: 1,
    name: "Карабин Alpha",
    price: 1200,
    price_discount: 1000,
  }),
  makeProduct({
    available: false,
    id: 2,
    name: "Ружьё Beta полуавтомат",
    price: 800,
    price_discount: 800,
  }),
  makeProduct({
    characteristics: [
      {
        label: "Тип действия",
        name: "action",
        value: "Болтовой",
      },
    ],
    id: 3,
    name: "Карабин Gamma",
    price: 1500,
    price_discount: 1400,
    reviews: 2,
  }),
];

test("cart reducer stores quantities and restores removed items", () => {
  let state = cartReducer(undefined, addToCart(10));
  state = cartReducer(state, addToCart(10));
  state = cartReducer(state, addToCart(20));

  assert.deepEqual(state.items, {
    10: 2,
    20: 1,
  });

  state = cartReducer(state, decreaseCartItem(10));
  assert.equal(state.items[10], 1);

  state = cartReducer(state, removeFromCart(10));
  assert.equal(state.items[10], undefined);

  state = cartReducer(
    state,
    restoreCartItem({
      productId: 10,
      quantity: 3,
    }),
  );
  assert.equal(state.items[10], 3);

  state = cartReducer(
    state,
    hydrateCart({
      30: 4,
    }),
  );
  assert.deepEqual(state.items, {
    30: 4,
  });
});

test("favorites reducer keeps unique ids and removes selected id", () => {
  let state = favoritesReducer(undefined, addToFavorites(1));
  state = favoritesReducer(state, addToFavorites(1));
  state = favoritesReducer(state, addToFavorites(2));

  assert.deepEqual(state.ids, [1, 2]);

  state = favoritesReducer(state, removeFromFavorites(1));
  assert.deepEqual(state.ids, [2]);
});

test("selectors calculate cart and favorite state", () => {
  const state = {
    cart: {
      items: {
        1: 2,
        3: 1,
      },
    },
    favorites: {
      ids: [3, 4],
    },
  };

  assert.equal(selectCartTotalCount(state), 3);
  assert.deepEqual(selectCartProductIds(state), [1, 3]);
  assert.equal(selectCartItemQuantity(1)(state), 2);
  assert.equal(selectIsProductInCart(2)(state), false);
  assert.equal(selectFavoritesCount(state), 2);
  assert.equal(selectIsProductFavorite(4)(state), true);
});

test("catalog helpers derive categories and product types", () => {
  assert.equal(getProductCategory(products[1]), "Ружье");
  assert.equal(getProductType(products[1]), "Полуавтоматический");
  assert.equal(getProductType(products[2]), "Болтовой");
  assert.deepEqual(getCatalogCategories(products), ["Карабин", "Ружье"]);
  assert.deepEqual(getCatalogProductTypes(products), [
    "Болтовой",
    "Полуавтоматический",
  ]);
});

test("catalog filtering applies search, availability, price, category and type", () => {
  const filtered = filterAndSortProducts(products, {
    availability: "available",
    category: "Карабин",
    maxPrice: "1200",
    minPrice: "900",
    productType: ALL_CATALOG_FILTER_VALUE,
    search: "alpha",
    sort: "default",
  });

  assert.deepEqual(
    filtered.map((product) => product.id),
    [1],
  );
});

test("catalog sorting and pagination are deterministic", () => {
  const sorted = filterAndSortProducts(products, {
    availability: ALL_CATALOG_FILTER_VALUE,
    category: ALL_CATALOG_FILTER_VALUE,
    maxPrice: "",
    minPrice: "",
    productType: ALL_CATALOG_FILTER_VALUE,
    search: "",
    sort: "price-desc",
  });

  assert.deepEqual(
    sorted.map((product) => product.id),
    [3, 1, 2],
  );
  assert.deepEqual(
    getCatalogPage(sorted, 2, 2).map((product) => product.id),
    [2],
  );
});

test("catalog can sort by rating field", () => {
  const sorted = filterAndSortProducts(products, {
    availability: ALL_CATALOG_FILTER_VALUE,
    category: ALL_CATALOG_FILTER_VALUE,
    maxPrice: "",
    minPrice: "",
    productType: ALL_CATALOG_FILTER_VALUE,
    search: "",
    sort: "rating-desc",
  });

  assert.deepEqual(
    sorted.map((product) => product.id),
    [3, 1, 2],
  );
});