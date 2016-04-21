var orders = new Array();
var hostname = location.origin;
var myOrder = {};


$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

// function validateForm() {
//     var x = document.forms["myForm"]["fname"].value;
//     if (x == null || x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }



function back() {
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
}
function createAccount() {
    var jsonObj = {};
     var x = document.getElementById("regis");
     //alert(x.elements[0].value);
     
    jsonObj.name = x.elements[0].value ;
    jsonObj.email = x.elements[1].value;
    jsonObj.pwd = x.elements[2].value;
    //alert(JSON.stringify(jsonObj));
    //console.log(JSON.stringify(jsonObj));
   
    //alert("Hello World");
    $.ajax({
        //url: "http://localhost:3000/createaccount",
        url:  hostname+ "/createaccount",
        method: "POST",
        data: JSON.stringify(jsonObj),
        //dataType: 'application/json',
        contentType: "application/json",
         success: function(result){
              alert(result);
              back();

         },
         error(){
             console.log('Error');
         }
    });
}

function login() {
    var jsonObj = {};
     var x = document.getElementById("login");
     //alert(x.elements[0].value);
    sessionStorage.removeItem('myOrder');
    sessionStorage.removeItem('orders');


    jsonObj.email = x.elements[0].value ;
    jsonObj.pwd = x.elements[1].value;
    //alert(JSON.stringify(jsonObj));
    //console.log(JSON.stringify(jsonObj));
    //alert("Hello World");
    //console.log(JSON.stringify(jsonObj));
    if(x.elements[0].value === undefined || x.elements[0].value === "" || x.elements[1].value === undefined || x.elements[0].value === "" ){
        console.log("true");
        alert('Username or Password is missing! Please enter again.');
    }else{

        $.ajax({
        //url: "http://localhost:3000/createaccount",
        //url: "http://localhost:3000/login",
        url: hostname + "/login",
        method: "POST",
        data: JSON.stringify(jsonObj),
        //dataType: 'application/json',
        contentType: "application/json",
         success: function(result){
             //alert(result);
             sessionStorage.setItem('userAccount', x.elements[0].value);
              window.location = "ChooseItems.html";
         },
         error(){
            alert('Username or Password is incorrect! Please try again.');
         }
    });

    }
    
}




// function getCookie(name) {
//   var value = "; " + document.cookie;
//   var parts = value.split("; " + name + "=");
//   if (parts.length == 2) return parts.pop().split(";").shift();
// }


function order(){
    var tblID = document.getElementById("list");
    var numRows = tblID.rows.length;
    console.log(tblID);

    for (var i = 1; i < numRows; i++) {
        var order = {};
            if(document.getElementsByTagName("tr")[i].getElementsByTagName("td")[0].firstChild.checked) {
                
                if (document.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].className == "item") {
                   // alert(document.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerText);
                    order.itemName = document.getElementsByTagName("tr")[i].getElementsByTagName("td")[2].innerText;
                }
                if (document.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].className == "price") {
                    
                    order.price = document.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerText;
                }
                if (document.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].className == "quantity") {
                    var e = document.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].childNodes;
                    order.quantity = document.getElementById('select-'+i).value;
                }
            orders.push(order);

            }
    }
    sessionStorage.setItem('orders',JSON.stringify(orders));
    //sessionStorage.orders = JSON.stringify(orders); 
//console.log(JSON.stringify(orders));
window.location = "CheckOut.html"

}

function logout(){
    sessionStorage.removeItem('myOrder');
    sessionStorage.removeItem('orders');
    sessionStorage.removeItem('userAccount');
}

function checkout() {

$.ajax({
        //url: "http://localhost:3000/createaccount",
        //url: "http://localhost:3000/login",
        url: hostname+ "/completeorder",
        method: "POST",
         headers: {
        "userAccount": sessionStorage.getItem('userAccount')
        },
        data: sessionStorage.getItem('myOrder'),
        //dataType: 'application/json',
        contentType: "application/json",
         success: function(result){
             alert(result);
             sessionStorage.removeItem('myOrder');
             sessionStorage.removeItem('orders');
             window.location = "Orders.html";
         },
         error(){
             console.log('Error');
         }
    });   

}

function proceedeToConfirm(){

     console.log(JSON.stringify(orders));
    // var address = document.getElementById('street').value + '  ' + document.getElementById('city').value + '  ' + document.getElementById('state').value + '  ' +  
    // document.getElementById('zip').value ;
    var address ={};
    address.street = document.getElementById('street').value  ;
    address.city =  document.getElementById('city').value;
    address.state = document.getElementById('state').value ;
    address.zip = document.getElementById('zip').value ;
    // var cardDetails =  document.getElementById('cardNumb').value + '  ' + document.getElementById('cardName').value + '  ' + document.getElementById('month').value+ '  ' + 
    //                    document.getElementById('year').value + '  ' + document.getElementById('code').value;
    var cardDetails = {};
    cardDetails.cardNumb = document.getElementById('cardNumb').value;
    cardDetails.cardName = document.getElementById('cardName').value;
    cardDetails.month =  document.getElementById('month').value;
    cardDetails.year = document.getElementById('year').value;
    cardDetails.secode = document.getElementById('code').value;



    

    myOrder.address = address;
    myOrder.cardDetails = cardDetails;
    //myOrder.order = JSON.parse(sessionStorage.orders);
    myOrder.order = JSON.parse(sessionStorage.getItem('orders'));
    //sessionStorage.myOrder = JSON.stringify(myOrder);
    sessionStorage.setItem('myOrder',JSON.stringify(myOrder));
    //console.log(myOrder);
     window.location = "Confirmation.html";
    

}

