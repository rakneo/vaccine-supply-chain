import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Button, KIND as ButtonKind} from 'baseui/button';
import Plus from 'baseui/icon/plus'
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
import {Input} from 'baseui/input';
import {
    useSnackbar,
  } from 'baseui/snackbar';
import { Table } from "baseui/table-semantic";
import useInstance from '../hooks/useInstance';
import API from '../utils/contract-api';
import { addTxToLogs } from '../utils/common';



export default () => {

    const [api, setApi] = useState(null);
    const [isSddModalOpen, setIsSddModalOpen] = useState(false);
    const [isMpsModalOpen, setIsMpsModalOpen] = useState(false);
    const [isMpModalOpen, setIsMpModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [sddData, setSddData] = useState({
        udpc: 0,
        price: 0.1,
    });
    const [mpsData, setMpsData] = useState({
        udpc: 0,
        share: 0,
    });
    const [mpData, setMpData] = useState({
        udpc: 0,
        p_addr: "",
        m_name: "",
        share: 0,
    });
    const [drugDesignData, setDrugDesignData] = useState([]);

    const context = useWeb3Context();
    const instance = useInstance();
    const {enqueue} = useSnackbar();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);

    const handleSellDrugDesignForm = async () =>{
        try {
            setIsButtonLoading(true);
            const trxn = await api.sellDrugDesign(context, sddData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsSddModalOpen(false);
            enqueue({message: `Drug Design Up For Sale UDPC: ${sddData.udpc}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handleUpdateMPSForm = async (_state) => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.updatePartnerState(context.account, _state, mpsData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsMpsModalOpen(false);
            enqueue({message: `M-Partnership State Updated | UDPC: ${mpsData.udpc}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handleMPForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.addPartner(context.account, mpData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsMpModalOpen(false);
            enqueue({message: `Manufacturer Partner Added | UDPC: ${mpsData.udpc}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    useEffect(() => {
        if(instance != null && api != null){
            api.getDrugDesigns(context.account)
            .then((res) => {

                console.log(res);


                const _list = [];

                res.forEach((item, idx) => {
                    if(item.currentOwner === context.account) {
                        _list.push([
                            idx+1,
                            item.currentOwner,
                            item.drugName,
                            item.designerName,
                            item.currentState,
                            (item.forSale) ? "Yes" : "No",
                            item.numberOfTests,
                            `${context.library.utils.fromWei(item.salePrice)} ETH`,
                        ]);
                    }
                });
                setDrugDesignData(_list);
            })
        }
    }, [api]);

    return (
      <>  
        <FlexGrid>
            <FlexGridItem
                style={{
                    margin: 16
                }}
            >
                <Button
                        style={{
                            marginRight: 8,
                        }}
                        startEnhancer={Plus} 
                        onClick={() => setIsSddModalOpen(true)}
                    > 
                        Sell Drug Design
                </Button>
                <Button
                        style={{
                            marginRight: 8,
                        }}
                        startEnhancer={Plus} 
                        onClick={() => setIsMpsModalOpen(true)}
                > 
                        Update M-Partnership State
                </Button>
                <Button
                        startEnhancer={Plus} 
                        onClick={() => setIsMpModalOpen(true)}
                > 
                        Add Partner
                </Button> 
            </FlexGridItem>
            <FlexGridItem
                style={{
                    width: '50%',
                    margin: 16,
                }}
            >
                <Table
                    columns={["UDPC", "Owner", "Drug Name", "Designer Name", "Status", "For Sale", "Number Of Tests", "Sale Price"]}
                    data={drugDesignData}
                />
                
            </FlexGridItem>
        </FlexGrid>
        {/* Update Manufacturer Partnership State Form */}

        <Modal
            onClose={() => setIsMpsModalOpen(false)}
            closeable
            isOpen={isMpsModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Update Manufacturer Partnership State</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={mpsData.udpc}
                        type="number"
                        onChange={(e) => setMpsData({...mpsData, udpc: parseInt(e.target.value)})}
                    />
                </FormControl>
                <FormControl
                    label={"Partnership Share"}
                    
                >
                    <Input
                        value={mpsData.share}
                        type="number"
                        onChange={(e) => setMpsData({...mpsData, share: parseInt(e.target.value)})}
                    />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={() => handleUpdateMPSForm("close")} isLoading={isButtonLoading}>Close</ModalButton>
                <ModalButton onClick={() => handleUpdateMPSForm("restrict")} isLoading={isButtonLoading}>Restrict</ModalButton>
                <ModalButton onClick={() => handleUpdateMPSForm("open")} isLoading={isButtonLoading}>Open</ModalButton>
            </ModalFooter>
        </Modal>
        {/* Sell Drug Design Form */}
        <Modal
            onClose={() => setIsSddModalOpen(false)}
            closeable
            isOpen={isSddModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Sell Drug Design</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={sddData.udpc}
                        type="number"
                        onChange={(e) => setSddData({...sddData, udpc: parseInt(e.target.value)})}
                    />
                </FormControl>
                <FormControl
                    label={"Price"}
                >
                    <Input 
                        value={sddData.price}
                        type="number"
                        step="any"
                        onChange={(e) => setSddData({...sddData, price: parseFloat(e.target.value)})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleSellDrugDesignForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>

        {/* Add Manufacturer Form */}

        <Modal
            onClose={() => setIsMpModalOpen(false)}
            closeable
            isOpen={isMpModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Add Manufacturer Form</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={mpData.udpc}
                        type="number"
                        onChange={(e) => setMpData({...mpData, udpc: parseInt(e.target.value)})}
                    />
                </FormControl>
                <FormControl
                    label={"Partner Address"}
                >
                    <Input 
                        value={mpData.p_addr}
                        onChange={(e) => setMpData({...mpData, p_addr: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Manufacturer Name"}
                >
                    <Input 
                        value={mpData.m_name}
                        onChange={(e) => setMpData({...mpData, m_name: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Partnership Share"}
                    
                >
                    <Input
                        value={mpData.share}
                        type="number"
                        onChange={(e) => setMpData({...mpData, share: parseInt(e.target.value)})}
                    />
                </FormControl>  
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleMPForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>


    </>    
    );
}