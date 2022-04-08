let Product = function (id,productName,photo,price,inventory){
    this.id=id;
    this.productName=productName;
    this.photo=photo;
    this.price=price;
    this.inventory=inventory;
}
let products = [
    new Product (1,'Nối','.//img/1.png',10000,300),
    new Product (2,'Nối rút','.//img/2.png',12000,10),
    new Product (3,'Nối ren trong thau','.//img/3.png',70000,150),
    new Product (4,'Nối ren ngoài thau','.//img/4.png',70000,150),
    new Product (5,'Khớp nối sống', './/img/5.png',11000,20),
    new Product (6,'Khớp nối sống ren ngoài thau', './/img/6.png',90000,60),
    new Product (7,'Nắp khóa','.//img/7.png',10000,300),
    new Product (8,'Nắp khóa ren ngoài','.//img/8.png',11000,100),
    new Product (9,'Co','.//img/9.png',11000,300),
    new Product (10,'Co ren ngoài thau','.//img/10.png',90000,50),
    new Product (11,'Co 45','.//img/11.png',12000,300),
    new Product (12,'Co ren trong thau','.//img/12.png',90000,100),
    new Product (13,'Co rút','.//img/13.png',15000,170),
    new Product (14,'T','.//img/14.png',15000,90),
    new Product (15,'T rút','.//img/15.png',19000,110),
    new Product (16,'T ren trong thau','.//img/16.png',120000,60),
    new Product (17,'T ren ngoài thau','.//img/17.png',120000,20),
    new Product (18,'Khúc tránh','.//img/18.png',10000,10),
    new Product (19,'Van gạt','.//img/19.png',170000,15),
    new Product (20,'Van xoay','.//img/20.png',190000,10),
    new Product (21,'Thân bích kép','.//img/21.png',9000,30),
    new Product (22,'Vai bích kép','.//img/22.png',9000,40),
    new Product (23,'Gioăng bích kép','.//img/23.png',8000,30),
];

function renderProduct(){
    let htmls = products.map(function(product,index){
        return `
        <div class="product">
            <img class='img' src="${product.photo}" onclick='addBill(${index})'>
            <p>Giá: ${formatCurrency(product.price)}</p>
            <p>Tồn kho: ${product.inventory} (cái)</p>
        </div>
            `
    });
    document.querySelector(".show_product").innerHTML = htmls.join("");
}

function formatCurrency(number) {
    return number.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
}

let Bill = function (id, productName, photo, price, count){
    this.id = id;
    this.productName = productName;
    this.photo = photo;
    this.price = price;
    this.count = count;
    this.amount = this.price * this.count;
};
let bill =[];

function addBill(index){
    if (products[index].inventory > 0) {
        products[index].inventory --;
        renderProduct();
        let buy = products.find(function(pdt){
            return pdt.id -1 == index;
        })
        let checkProduct = bill.find(function(item){
            return item.id -1 == index;
        })
        if(checkProduct === undefined){
            let billItem = new Bill(buy.id, buy.productName, buy.photo, buy.price, 1)
            bill.push(billItem);
        }
        else{
            checkProduct.count ++;
            checkProduct.amount = checkProduct.count * checkProduct.price;
        }
        showBillDetail();
        }
}
function showBillDetail(){
    let htmls = bill.map(function(item,position){
        return `
            <tr>
                <td class='text-align'>${position +1}</td>
                <td class='td_name'>${item.productName}</td>
                <td class='td_number'>${formatCurrency(item.price)}</td>
                <td>
                    <Button title='Giảm' onclick=less(${position})>-</Button>
                    <input id='count_${position}' type="number" style="width:25px; text-align: center;" value='${item.count}' onchange='changeCount(${position})'>
                    <Button title='Thêm' onclick=add(${position})>+</Button>
                </td>
                <td class='td_number'>${formatCurrency(item.amount)}</td>
                <td>
                    <a href="javascrip:;" title='Xóa' onclick="removeItem(${position})">
                        <i class="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
        `
    })
    document.querySelector("#bill_detail>tbody").innerHTML = htmls.join("");
    total();
}
function total(){
    let total = 0;
    for (let i=0; i<bill.length; i++) {
        total += bill[i].amount;
    } document.getElementById('total').innerHTML=`${formatCurrency(total)}`;
}
function removeItem(position) {
    let index = products.findIndex(function(name){
        return bill[position].productName == name.productName;
        })
    products[index].inventory += bill[position].count;
    bill.splice(position,1);
    showBillDetail();
    renderProduct();  
}
function changeCount(position) {
    let index = products.findIndex(function(name){
        return bill[position].productName == name.productName;
        })   
    let initialInventory = products[index].inventory + bill[position].count;
    let input = document.getElementById(`count_${position}`);
    if (input.value <0) {
        alert('Số lượng sai, không nhập số âm');
        input.value = bill[position].count;
        showBillDetail();
    } else if (input.value == 0) removeItem(position);
    else if (input.value > initialInventory) {
        alert(`Vượt tồn kho, chỉ có ${initialInventory} cái`);
        input.value = bill[position].count;
        showBillDetail();
    } else {
        products[index].inventory = initialInventory - input.value;
        renderProduct();
        bill[position].count = Number(input.value);
        bill[position].amount = bill[position].price * bill[position].count;
        showBillDetail();
    }
}
function add(position){
    let index = products.findIndex(function(name){
        return bill[position].productName == name.productName;
        })
    if (products[index].inventory > 0) {
        bill[position].count++;
        bill[position].amount = bill[position].count * bill[position].price;
        showBillDetail();
        products[index].inventory --;
        renderProduct();
    }
}
function less(position){
    if (bill[position].count > 0) {
        bill[position].count--;
        bill[position].amount = bill[position].count * bill[position].price;
        showBillDetail();
        let index = products.findIndex(function(name){
            return bill[position].productName == name.productName;
            })
        products[index].inventory ++;
        renderProduct();
    }
    if (bill[position].count == 0) {
        removeItem(position);
    }
}
function sortProduct() {
    bill.sort((a, b) => a.productName.localeCompare(b.productName));
    showBillDetail();
}
function resetBill() {
    bill=[];
    showBillDetail();
}
renderProduct();
