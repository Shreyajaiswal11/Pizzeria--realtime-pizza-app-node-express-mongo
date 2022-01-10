
import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from './apiService'
export async function initStripe(){
    const stripe = await loadStripe('pk_test_51KD1aRSGlkrwTyDV82udtMFkilkc3y7iMqxDB4pjrqD2G82RJpwxjxJ8ovazjfgugV8hhrrzhemb2OWPC2NAUhmo00uagdvnlH');
  
    let card=null;
    function mountWidget(){
        const element=stripe.elements()
        let style = {
            base: {
             color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                  color: '#aab7c4'
              }
              },
              invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
              }
          };
          card=element.create('card',{style,hidePostalCode:true})
          card.mount('#card-element')
    }
    

    const paymentType=document.querySelector('#paymentType')
    if(!paymentType){
        return;
    }
    paymentType.addEventListener('change',(e) =>{
        if(e.target.value==='card'){
            //display widget
            mountWidget();
        } else {
            card.destroy()
        }
    })
    //Ajax Call

const paymentForm = document.querySelector('#payment-form');
if(paymentForm){
    paymentForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formData=new FormData(paymentForm);
        let formObject={}
        for(let[key,value] of formData.entries()){
            formObject[key]=value
        }

         if(!card){
            placeOrder(formObject)
            return;
         }
         //Verify card
        stripe.createToken(card).then((result) =>{
            console.log(result)
            formObject.stripeToken=result.token.id;
            placeOrder(formObject); 
        }).catch((err)=>{
            console.log(err)
        })

  
        console.log(formObject);
        })
        
}
}