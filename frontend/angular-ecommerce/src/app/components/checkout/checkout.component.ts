 import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopFormServiceService } from '../../services/shop-form-service.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countires: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormServiceService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          firstName: [''],
          lastName: [''],
          email: ['']
        }),
        shippingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: Country,
          zipCode: ['']
        }),
        billingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: ['']
        }),
        creditCard: this.formBuilder.group({
          cardType: [''],
          nameOnCard: [''],
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
        })
      });

      // populate credit card months
      const startMonth: number = new Date().getMonth() + 1;
      console.log("startMonth: " + startMonth);

      this.shopFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      );

      // populate credit card years
      this.shopFormService.getCreditCardYears().subscribe(
        data => {
          console.log("Retrieved credit card years: " + JSON.stringify(data));
          this.creditCardYears = data;
        }
      );

      // populate countries
      this.shopFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countires = data;
        }
      );
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }


  copyShippingAddressToBillingAddres($event: Event) {
    if(($event.target as HTMLInputElement)?.checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthAndYear($event: Event) {
    
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear); 

    // if the current year equals the selected year, then start with the current month
    let startMonth: number;
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );  

  }

  getStates(formGroupName: string) {
    
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    
    // console.log(this.checkoutFormGroup.get('shippingAddress')?.value.country);

    // const countryCode = formGroup?.value.country.code;
    // const countryName = formGroup?.value.country.name;  

    // console.log(`{formGroupName} country code: ${countryCode}`);
    // console.log(`{formGroupName} country name: ${countryName}`);

    const countryName = formGroup?.value.country;
    console.log(`Country Name: ${countryName}`);

    const countryCode =  this.countires.find(c=> c.name === countryName)?.code;

    this.shopFormService.getStates(countryCode!).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

}
