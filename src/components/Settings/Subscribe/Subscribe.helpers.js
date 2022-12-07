export const productStatus = subscriptions => {
  if (isOwned(subscriptions))
    //statusElement.textContent = 'Subscribed';
    return 'owned';
  if (isApproved(subscriptions))
    // statusElement.textContent = 'Processing...';
    return 'approved';
  if (isInitiated(subscriptions)) return 'initiated';

  return 'not suscribed'; //statusElement.textContent = 'Not Subscribed';
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
