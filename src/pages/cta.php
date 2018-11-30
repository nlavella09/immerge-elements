<?php

  $info = $_POST['info'];
  
  $firstName = $info['name'];
  $email = $info['email'];
  $phone = $info['phone'];
  $message = $info['message'];
  
 // if($_POST['zipcode'] == ''){
	 $email_from = 'elements@immergeinteractive.com';
	 $email_subject = "New Elements Inquiry From ".$firstName.' '.$lastName;
	 
	 
	$email_body = "Name: $firstName\n".
	                "Email: $email\n".
	                "Phone: $phone\n".
	                "Message: $message";
	                
	$to = 'nl@nicholaslavella.com';                           
	                  
	mail($to,$email_subject,$email_body);
 // }
	  
	header("Location:index.php?thankyou=true");

?>