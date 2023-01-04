export const getProductStatus = () => {
  const subscriptions = window.CdvPurchase.store.products.filter(
    p => p.type === window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
  );

  // if (isOwned(subscriptions)) return 'OWNED';
  if (isApproved(subscriptions) || isInitiated(subscriptions))
    return 'proccesing';
  return 'not_subscribed';
};

const isOwned = products => {
  return !!findVerifiedPurchase(products, p => !p.isExpired);
};

const isApproved = products => {
  return !!findLocalTransaction(
    products,
    t => t.state === window.CdvPurchase.TransactionState.APPROVED
  );
};

const isInitiated = products => {
  return !!findLocalTransaction(
    products,
    t => t.state === window.CdvPurchase.TransactionState.INITIATED
  );
};

const findVerifiedPurchase = (products, filter) => {
  for (const product of products) {
    //const purchase = window.CdvPurchase.store.findInVerifiedReceipts(product);
    const purchase = findInVerifiedReceipts(product);
    if (!purchase) continue;
    if (filter(purchase)) return purchase;
  }
};

// Find a local transaction for one of the provided products that passes the given filter.
const findLocalTransaction = (products, filter) => {
  // find if some of those products are part of a receipt
  for (const product of products) {
    console.log(product);
    const transaction = window.CdvPurchase.store.findInLocalReceipts(product);
    //const transaction = findInLocalReceipts(product);
    console.log('transaction in local receipt', transaction);
    if (!transaction) continue;
    if (filter(transaction)) return transaction;
  }
};

const findInLocalReceipts = product => {
  if (!product) return undefined;
  const localReceipts = window.CdvPurchase.store.localReceipts;
  let found;
  for (const receipt of localReceipts) {
    if (product.platform && receipt.platform !== product.platform) continue;
    for (const transaction of receipt.transactions) {
      for (const trProducts of transaction.products) {
        if (trProducts.id === product.id) {
          // prettier-ignore
          if ((transaction.purchaseDate ?? 0) < (found?.purchaseDate ?? 1) || !found) {
            found = transaction;
          }
        }
      }
    }
  }
  return found;
};

const findInVerifiedReceipts = product => {
  if (!product) return undefined;
  const verifiedReceipts = window.CdvPurchase.store.verifiedReceipts;
  let found;
  for (const receipt of verifiedReceipts) {
    if (product.platform && receipt.platform !== product.platform) continue;
    //for (const purchase of receipt.collection) {
    //   if (purchase.id === product.id) {
    //     if ((found?.purchaseDate ?? 0) < (purchase.purchaseDate ?? 1) || !found)
    found = receipt.nativeTransactions[0].data.transaction;
    //   }
    //}
  }
  return found;
};

export const formatDuration = iso => {
  if (!iso) return '';
  const l = iso.length;
  const n = iso.slice(1, l - 1);
  if (n === '1') {
    return (
      { D: 'Day', W: 'Week', M: 'Month', Y: 'Year' }[iso[l - 1]] || iso[l - 1]
    );
  } else {
    const u =
      { D: 'Days', W: 'Weeks', M: 'Months', Y: 'Years' }[iso[l - 1]] ||
      iso[l - 1];
    return `${n} ${u}`;
  }
};

export const formatTitle = title => {
  if (!title) return '';
  return title.replace('(Cboard AAC)', '');
};
