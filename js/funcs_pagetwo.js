function goingToPagetwo()
{
	$("#billDetails").text('');
	$('<div class="ui-block-a"><h3>PRODUCT NAME</h3></div><div class="ui-block-b"><h3>QUANTITY</h3></div><div class="ui-block-c"><h3>PRICE</h3></div><div class="ui-block-d"><h3>SUB-TOTAL</h3></div></div>').appendTo("#billDetails");
	
	$("#grandTotalPagetwo").text(total_price);
	
	for(i = 0;i<cart_top;i++)
	{
		addBillToDisplay(i);
		total_Discount+=(cart[i].mrp - cart[i].mallPrice)*cart[i].qty;
	}
	$("#totalDiscountPagetwo").text(total_Discount);
}


function addBillToDisplay(index)
{
	var $bill=$('<div class="ui-block-a">' + cart[index].pdName + '</div><div class="ui-block-b">' + cart[index].qty + '</div><div class="ui-block-c">' + cart[index].mallPrice + '</div><div class="ui-block-d">' + cart[index].subTotal + '</div>  ').appendTo(document.getElementById('billDetails'));
}


function sendToBiller()
{
		event.preventDefault();
		
		cartForServer = new cartS(cartID,cart_top,cart,total_price);
		var finurl=server_url;
		dat= JSON.stringify(cartForServer);

		$.ajax
		({
			type: "POST",
			url: finurl,
			//contentType : 'application/json',
			data:dat,
			success: function (data) 
			{
				alert('Thank you for shopping with Virtual Cart. Your bill has been generated. You can collect it from any billing counter.');
			},
			error: function ()
			{
				alert('Sorry! there seems to be a problem with our servers. Please try paying after some time.');
			}	
		});
}


function cartS( cartID,  itemQuantity, prodarr, total)
{
	this.cartID=cartID;
	this.itemQuantity=itemQuantity;
	this.prodarr=prodarr;
	this.total=total;
}