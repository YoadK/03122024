export function getTotalOrderValue(jsonObject: any) {
    let totalPrice = 0;
    let stack = [jsonObject];

    while (stack.length > 0) {
        let current = stack.pop();
        console.log('current element/value is: ', current);

        if (Array.isArray(current)) {
            // If current is an array, push all elements to the stack
            for (let item of current) {
                stack.push(item);
            }
        } else if (typeof current === 'object' && current !== null) {
            // If current is an object, check for 'price_per_unit' and push properties to the stack
            if (current.hasOwnProperty('line_items')) {
                const lineItems = current.line_items;
                totalPrice += lineItems.reduce((sum, item) => 
                    sum + (parseFloat(item.price_per_unit) * item.quantity), 0);
            }
            
            for (let key in current) {
                if (current.hasOwnProperty(key)) {
                    stack.push(current[key]);
                }
            }
        }
    }

    return totalPrice;
}

// Example usage
const request1 = {
  "order_no": "12345",
  "buyer_id": "raambo",
  "line_items": [
    {
      "line": 1,
      "sku": "tr100",
      "vendor": "Internal",
      "quantity": 1,
      "price_per_unit": 10
    },
    {
      "line": 2,
      "sku": "tbz",
      "vendor": "External",
      "quantity": 24.0,
      "price_per_unit": 1
    }
  ]
};

const totalValue = getTotalOrderValue(request1);
console.log("Total Order Value:", totalValue);