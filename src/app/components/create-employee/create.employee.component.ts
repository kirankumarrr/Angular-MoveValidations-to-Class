import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
@Component({
  selector: "create-employee",
  templateUrl: "./create.employee.component.html",
  styleUrls: ["./create.employee.component.css"]
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    fullName: "",
    contactPreference: "",
    email: "",
    phone: "",
    skillName: "",
    experienceInYears: "",
    proficiency: ""
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    fullName: {
      required: "Full Name is required.",
      minlength: "Full Name must be greater than 2 characters.",
      maxlength: "Full Name must be less than 10 characters."
    },
    email: {
      required: "Email is required.",
      emailDomain: "Email Doamin should end with dell.com"
    },
    phone: {
      required: "Phone is required."
    },
    skillName: {
      required: "Skill Name is required."
    },
    experienceInYears: {
      required: "Experience is required."
    },
    proficiency: {
      required: "Proficiency is required."
    }
  };

  //Instead of creating function we can this other way

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]
      ],
      contactPreference: ["email"],
      //Adding Custom Validator
      email: ["", [Validators.required, emailDomain("dell.com")]],
      phone: [""],
      skills: this.fb.group({
        skillName: ["", Validators.required],
        experienceInYears: ["", Validators.required],
        proficiency: ["", Validators.required]
      })
    });
    //This event will call every Time when changes happends in the form

    this.employeeForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.employeeForm);
    });
    this.employeeForm
      .get("contactPreference")
      .valueChanges.subscribe((data: string) => {
        this.contactPreferenceChange(data);
      });
  }
  contactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get("phone");
    if (selectedValue === "phone") {
      phoneControl.setValidators(Validators.required);
      //Incase you want to set more than one validator
      // phoneControl.setValidator([Validators.required, Validators.minLength(3)]);
    } else {
      phoneControl.clearValidators();
    }
    //After clearValidator if you want to trigger immediately you neeed to call updateValueAndValidity()
    phoneControl.updateValueAndValidity();
  }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        this.formErrors[key] = "";
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          // Get all the validation messages of the form control
          // that has failed the validation
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + " ";
            }
          }
        }
      }
    });
  }

  OnSubmit() {
    console.log(this.employeeForm);
  }

  onLoadDataClick(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }
}

// function emailDomain(control: AbstractControl): { [key: string]: any } | null {
//   const email: string = control.value;
//   const domain = email.substring(email.lastIndexOf("@") + 1);
//   if (email === "" || domain === "gmail.com") {
//     return null;
//   } else {
//     //here you should only return object
//     return { emailDomain: true };
//   }
// }

//Here we are going to create a function that takes parameter and we never hard code our domainName

// We are usnig Clousers Concept over here
function emailDomain(domainName: string) {
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
