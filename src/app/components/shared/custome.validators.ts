import { AbstractControl } from "@angular/forms";
export class CustomeValidators {
  static emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf("@") + 1);
      if (email === "" || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      } else {
        //here you should only return object
        return { emailDomain: true };
      }
    };
  }
}
