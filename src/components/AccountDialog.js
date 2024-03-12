import React from "react";
import { NumericTextBoxComponent , TextBoxComponent} from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const AccountDialog = (props) => {
    
    return(
        <div>
            <div className="flex flex-col p-4 ">
                <div className="">
                    <TextBoxComponent style={{ width: "500px" }} id='password' value={props.password} placeholder="Mật khẩu" floatLabelType="Auto"/>
                </div>
            </div>
        </div>
    )
} 

export default AccountDialog