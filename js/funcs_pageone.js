var actualValue;//to be removed

function begin()
{
	assignment();
	//confirm();
	//if( qty>0 && qty!=NaN )
	{
		ok();   
	}
	updateAllConstantsDisplay();
}
//end

function updateAllConstantsDisplay()
{
	$("#total_price").text(total_price);
	$("#total_items").text(cart_top);
}

//to assign the details from the Qrcode to the global variables;
function assignment()
{
  pdId=details[0];
  pdName=details[1];
  mrp=convert(details[2]);//price is parsed
  server_url=details[3];
}
//end


//if the user presses OK
// function confirm()
// {
	// var x=check();
	// if(x!=0)
	// {
		// qty=prompt(pdName+"   "+pdId+"    "+"\nenter quantity:","1");												//to be changed
	
		// if(qty!=null)//if non-empty
		// {
			// qty=convert(qty);//may or maynot be a number
		// }
	// }
	// else
	// {
		// alert("This item is already present in your cart. Your item will be incremented.");
		// qty=prompt(pdName+"   "+pdId+"    "+"\nenter quantity:","1");	
		// qty=convert(qty);
	// }
// }
//end


//to check if the item scanned is already present in the cart
function ok()
{
   var x=check();
   if(x==0)//present
  {
      
      //if(confirm("do you wish to replace the existing item?")==true)//( user presses OK)
      changeQtyRescan();																					//to change to increment instead of replace
	  //else( user presses CANCEL)
	      //ignore
  }
   else//not present
  {
		//alert("You have scanned a new item.");
		subTotal=calc_subtotal(qty,mrp);
		create_object();
		total_price+=subTotal;  
		addEntry();
		getDetails();
  }
}
//end


function changeQtyRescan()
{
alert('This item is already present in your cart.');
    var i;
	for(i=0;i<cart_top;i++)
	{
		if(cart[i].pdId.localeCompare(pdId)==0)
			break;
	}

	cart[i].qty+=1; 
	cart[i].subTotal=calc_subtotal(cart[i].mallPrice,cart[i].qty);
	total_price+=calc_subtotal(cart[i].mallPrice,qty);
	{
		//$("#img" + cart[i].pdId).attr("src",cart[i].imgURL);
		$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
		$("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
		//$("#mPrice" + cart[i].pdId).text(cart[i].mallPrice);
	}
}


//Server request to get product details
function getDetails()
{
/* Handle errors if product scanned is not in server database. To do this we can use a flag attribute in product.*/
    alert('in get details');//to be removed
	event.preventDefault();

	var finurl= getQueryString(server_url,pdId);
	var jqxhr= $.get( finurl, function( data ) {
	//alert(data);

	alert('Server has sent the data');
	//$("#getResult").text(data.mallPrice+" "+ data.imgURL);
	//$("#dynimg").attr("src", data.imgURL);
	
	
	var i;
	for(i=0;i<cart_top;i++)
	{
	if((cart[i].pdId.localeCompare(data.pdId))==0)
	break;
	}
	
	{
		total_price-=cart[i].subTotal;
		data.qty=qty;
		data.subTotal=calc_subtotal(data.qty,data.mallPrice);
		cart[i] = data;
		alert(data.offer);
		
		
	}
	{
		$("#img" + cart[i].pdId).attr("src",cart[i].imgURL);
		$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
		$("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
		$("#mPrice" + cart[i].pdId).text(cart[i].mallPrice);
	}
	total_price+=cart[i].subTotal;
	
	updateAllConstantsDisplay();
	},"json");

	
	//var pdImg=document.getElementById('img' + cart[i].pdId + '');
	
	
}
//end


//to create the query string
function getQueryString (url,pid)
{	
return  url+"?method=getProductDetails&pID="+pid;	
}
//end


//Constructor for product class
function product(pdName,pdId,mallPrice,qty,subTotal,mrp)
{
	this.pdName = pdName;
	this.pdId = pdId;
	this.mallPrice = mallPrice;
	this.qty=qty;
    this.subTotal=subTotal;
	this.mrp = mrp;
	//this.remove_object=remove_object;	
}


//to remove the product object from the cart array
function remove_object(id)
{
	var i;
	
    for(i=0;i<cart_top;i++)
   {
        if((cart[i].pdId.localeCompare(id))==0)
        break;
   }
    
    total_price-=cart[i].subTotal;//update the total price 
	
	var temp_arr_start=cart.splice(0,i+1);
	temp_arr_start.pop();
	cart=temp_arr_start.concat(cart);
    
	cart_top-=1;//update the cart index
	
	removeFromDisplay(id);
	updateAllConstantsDisplay();
	disableEnablePayLink();
}
//end


//creates a product object and inserts into the cart array
function create_object()
{
    var tempprod=new product(pdName,pdId,mrp,qty,subTotal,mrp);
    cart.push(tempprod);
    cart_top++;
	disableEnablePayLink();
}
//end


//when an existing item is scanned,replacement occurs
// function replace()
// {
    // var i;
    // for(i=0;i<cart_top;i++)
  // {
        // if((cart[i].pdId.localeCompare(pdId))==0)
        // break;
  // }
    // subTotal=calc_subtotal(qty,cart[i].mallPrice);//calculate the subtotal for now
	// cart[i].qty=qty;//replace the qty;
	// total_price=total_price-(cart[i].subTotal);//decrement the existing item's subtotal
    // cart[i].subTotal=subTotal;//update the subtotal;
	// total_price=total_price+subTotal;//update the total price
		
	// $("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
	// $("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
	
	// updateAllConstantsDisplay();
// }
//end


//auxillary functions

//to parse string into integer
function convert(x)
{
   return parseFloat(x);
}
//end


//to calculate the item's subtotal
function calc_subtotal(mallPrice,qty)
{
  return mallPrice*qty;
}
//end


//to check if the item is already present in the cart array
function check()
{
  var i;
  for(i=0;i<cart_top;i++)
 {
    if((cart[i].pdId.localeCompare(pdId))==0)
       return 0;
 }
  return 1;
}
//end





//to add the product to the visible cart
 function addEntry()
 {
 
 ('in add entry');
 var $ele=$('<div data-role="collapsible" data-collapsed="false" id="'+pdId+'"><h1>'+pdName+'<a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="remove_object(this.id)" id = "'+pdId+'" style="float: right;"></a></h1><div class="ui-grid-b"><div class="ui-block-a"><span><img src="" height = "70px"/ id="img' + pdId + '"></span></div><div class="ui-block-b"><span> <strong>Name:'+pdName+'<br>Id:'+pdId+' </strong><br><strong>Price: <span  id="mPrice' + pdId + '">'+mallPrice+'</span> </strong></span></div><div class="ui-block-c"><input type="number" name="spin" id="qt__'+pdId+'" value='+qty+' min="1"  onkeyup = "changeQuantity(this.id,this.value)" /></div><div class = "ui-block-c"> <strong>Subtotal: <span id="sTotal' + pdId + '">'+subTotal+'</span></strong></div></div></div>').appendTo(document.getElementById('wrapper'));
 //<input type="text" name="quantity" onkeyup="changeQuantity(this.id)" value="'+qty+'" id="qt__' + pdId + '" >
 $ele.collapsible();
 //$("input[name=spin]").spinbox();
 
/*  <div data-role="fieldcontain">
    <label for="spin">Input spinner</label>
    <input type="text" data-role="spinbox" name="spin" id="spin" value='qty' min="1" />
</div> */
 }
//end 


function removeFromDisplay(id)
{
	$("#"+id).remove();
}

function changeQuantity(qtId,qtValue)
{
	//alert('In changeQuantity ' + qtId);
	var actualId = qtId.split("__").pop();
	//alert('actualId= ' + actualId);
	var i;
	 actualValue = qtValue;
    for(i=0;i<cart_top;i++)
  {
        if((cart[i].pdId.localeCompare(actualId))==0)
        break;
  }
   var temp_subTotal=calc_subtotal(actualValue,cart[i].mallPrice);//calculate the subtotal for now
	//alert('new sub total ' + temp_subTotal);
	cart[i].qty=actualValue;//replace the qty;
	total_price=total_price-(cart[i].subTotal);//decrement the existing item's subtotal
    cart[i].subTotal=temp_subTotal;//update the subtotal;
	total_price+=temp_subTotal;//update the total price
		
	//$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
	$("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
	
	updateAllConstantsDisplay();
}

function disableEnablePayLink()
{
	if(cart_top != 0)
	{
		$("#payButton").attr("href",'#pagetwo');
	}
	else
	{
		$("#payButton").attr("href",'#');
	}
}

function deleteAll()
{
cart=[];//empty the cart array

$("#wrapper").text("");//empty the display
total_price=0;
$("#total_price").text(total_price);
cart_top=0;
$("#total_items").text(cart_top);

disableEnablePayLink();
}


function firstFunction()
{
	cartID = parseInt(Math.random() * 10000);
	updateAllConstantsDisplay();
}


//to splice the information.....called after scanner
function splitter(info)
{
	details=info.split(",");
}
//end
