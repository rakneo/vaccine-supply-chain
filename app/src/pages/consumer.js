import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Button, KIND as ButtonKind} from 'baseui/button';
import Plus from 'baseui/icon/plus';
import Check from 'baseui/icon/check';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
  } from "baseui/modal";
import { FormControl } from "baseui/form-control";
import {Input, SIZE as inputSize} from 'baseui/input';
import {
    useSnackbar,
  } from 'baseui/snackbar';
import {
    Checkbox,
    STYLE_TYPE,
    LABEL_PLACEMENT
} from "baseui/checkbox";
import { Textarea } from "baseui/textarea";
import useInstance from '../hooks/useInstance';
import API from '../utils/contract-api';
import { addTxToLogs } from '../utils/common';


export default (props) => {

    const [api, setApi] = useState(null);
    const [isBdModalOpen, setIsBdModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {enqueue} = useSnackbar();

    const [bdData, setBdData] = useState({
        pku: "",
        price: ""
    });

    const context = useWeb3Context();
    const instance = useInstance();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);

   const handleBuyDrugForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.buyDrug(context, bdData);
        console.log(trxn);
        setIsButtonLoading(false);
        setIsBdModalOpen(false);
        enqueue({message: `Bought PKU: ${bdData.pku}`});
    } catch(err){
        console.log(err);
    }

   }

    return (
     <> 
        <FlexGrid>
            <FlexGridItem
                style={{
                    margin: 16,
                    float: 'right'
                }}
            >
                <Button
                    style={{
                        marginRight: 8,
                    }}
                    startEnhancer={Check}
                    onClick={() => setIsBdModalOpen(true)}
                >
                   Buy Drug 
                </Button>
            </FlexGridItem>
        </FlexGrid>

        {/* Aprove Drug Form */}

        <Modal
            onClose={() => setIsBdModalOpen(false)}
            closeable
            isOpen={isBdModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Add New Drug Test Case</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"PKU"}
                >
                    <Input 
                        value={bdData.pku}
                        onChange={(e) => setBdData({...bdData, pku: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Price"}
                >
                    <Input 
                        value={bdData.price}
                        onChange={(e) => setBdData({...bdData, price: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleBuyDrugForm} isLoading={isButtonLoading}>Buy</ModalButton>
            </ModalFooter>
        </Modal>
     </>);
} 