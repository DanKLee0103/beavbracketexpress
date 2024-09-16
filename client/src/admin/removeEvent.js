import React, {useState} from 'react';
import { Modal } from 'antd';

function RemoveEvent( {id} ){


    return(
        <div>
            <Modal title = "Login" open = {true} centered = {true} onOk = {false} onCancel={false} okText = "Delete">
                
            </Modal>
        </div>
    );
}

export default RemoveEvent;