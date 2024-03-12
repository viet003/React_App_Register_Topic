import React from "react";
import { NumericTextBoxComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import * as CryptoJS from "../utils/crypto"

const UserDialog = (props) => {

    return (
        <div>
            <div className="flex flex-col p-4 ">
                <div className="">
                    <TextBoxComponent style={{ width: "300px" }} id='id' value={props.id} placeholder="ID" floatLabelType="Auto" enabled={false} />
                </div>
                <div className="">
                    <TextBoxComponent style={{ width: "300px" }} id='name' value={CryptoJS.decrypted(props.name)} placeholder="Họ và tên" floatLabelType="Auto" />
                </div>
                <div className="">
                    <DatePickerComponent style={{ width: "300px" }} id='dob' value={CryptoJS.decrypted(props.dob)} placeholder="Ngày sinh" floatLabelType="Auto" format='dd/MM/yyyy' />
                </div>
                <div className="">
                    <TextBoxComponent style={{ width: "300px" }} id='major' value={CryptoJS.decrypted(props.major)} placeholder="Ngành" floatLabelType="Auto" />
                </div>
                {
                    props.class && (
                        <div className="">
                            <TextBoxComponent style={{ width: "300px" }} id='class' value={CryptoJS.decrypted(props.class)} placeholder="Lớp" floatLabelType="Auto" />
                        </div>
                    )
                }
                <div className="">
                    <TextBoxComponent style={{ width: "300px" }} id='department' value={CryptoJS.decrypted(props.department)} placeholder="Khoa" floatLabelType="Auto" />
                </div>
                <div className="">
                    <DropDownListComponent
                        style={{ width: "300px" }}
                        id='isActive'
                        placeholder="Trạng thái"
                        floatLabelType="Auto"
                        dataSource={[
                            { text: 'Hoạt động', value: 1 },
                            { text: 'Dừng hoạt động', value: 0 }
                        ]}
                        fields={{ text: 'text', value: 'value' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default UserDialog