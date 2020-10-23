

class ContractAPI {
    constructor (instance) {
        this.instance = instance;
      
    }

    currentAccountRoles = async (account) =>{
        let myRoles = await this.instance.methods.whoAmI().call({from: account});
        const keys = Object.keys(myRoles);
        const values = Object.values(myRoles);
        let updatedRoles = [];
        for (var i = 6; i < 12; i++) {
            updatedRoles.push({role: keys[i], status: values[i]});
        }
        console.log("Roles: ", updatedRoles);
        return updatedRoles;
    }

    getUdpc = async(account) => {
        return new Promise(async (resolve, reject) => {
            try{
                const udpc = await this.instance.methods.getUdpc().call({from: account});
                resolve(udpc);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }

    getDrugDesigns = async(account) => {
		return new Promise(async (resolve, reject) => {
            try {
                let udpc = await this.getUdpc(account);
                const data = [];
                if(udpc > 0) {
                    for(let i=1; i <= udpc; i++){
                        const drugDesign = await this.instance.methods.fetchDrugDesignData(i).call({from: account});
                        data.push(drugDesign);
                    }
                }
                resolve(data);
                
            } catch(err) {
                console.log(err);
                reject(err);
            }
        });
    }
    
    designDrug = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { designerName, drugName, description, notes } = data;
                const trxn = await this.instance.methods.designDrug(
                    designerName,
                    drugName,
                    description,
                    notes
                ).send({ from: account });
                resolve(trxn);
            } catch (err) {
                reject(err);
            }
        });
    }

    addDesignerTestCase = async (account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc, description, notes, passed} = data;
                console.log(data);
                const trxn = await this.instance.methods.addTestCase(
                    udpc,
                    description,
                    passed,
                    notes
                ).send({ from: account });
                resolve(trxn);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    addRegulatorTestCase = async (account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc, description, notes, passed} = data;
                console.log(data);
                const trxn = await this.instance.methods.addTestCaseByRegulaor(
                    udpc,
                    description,
                    passed,
                    notes
                ).send({ from: account });
                resolve(trxn);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    sellDrugDesign = async(context, data) => {
		return new Promise(async (resolve, reject) => {
            try {
                const {udpc, price} = data;
                let priceInWei = context.library.utils.toWei(price.toString());
                console.log("price in wei: ", priceInWei);
                let trxn = await this.instance.methods.upForSale(
                    udpc,
                    priceInWei
                ).send({from: context.account});
                resolve(trxn);
                
            } catch(err) {
               reject(err);
            }
        });
    }

    purchaseDrugDesign = async(context, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const {udpc, price} = data;
                console.log(data);
                let priceInWei = context.library.utils.toWei(price);
                let trxn = await this.instance.methods.purchaseDrugDesign(udpc)
                .send({
                    from: context.account,
                    value: priceInWei
                });
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }
    
    approveDrug = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc } = data;
                const trxn = await this.instance.methods.approveDrug(udpc).send({from: account})
                resolve(trxn);
            } catch(err) {
                reject(err)
            }
        });
    }

    updatePartnerState = async (account,_state, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc, share } = data;
                let trxn = null;
                switch(_state){
                    case 'close':
					trxn = await this.instance.methods.closeManufactPartnership(
						udpc
					).send({from: account})
				break
				case 'open':
					trxn = await this.instance.methods.openManufactPartnership(
						udpc,
						share
					).send({from: account})
				break
				case 'restrict':
					trxn = await this.instance.methods.restrictManufactPartnership(
						udpc
					).send({from: account})
				break
                }

                resolve(trxn)
            } catch(err){
                reject(err);
            }
        });
    }

    addPartner = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const {udpc, p_addr, m_name, share} = data;

                const trxn = await this.instance.methods.buildRestrictPartnerContract(
                    udpc,
                    p_addr,
                    m_name,
                    share,
                ).send({from: account});
                    
                resolve(trxn);

            } catch(err) {
                reject(err);
            }
        });
    }

    buildPartnership = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc, m_name } = data;
                const trxn = await this.instance.methods.buildPartnerContract(
                    udpc,
                    m_name
                ).send({from: account});
                resolve(trxn);
            } catch(err){
                reject(err);
            }
        });
    }

    manufactureDrugLoad = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { udpc, qty } = data;
                const trxn = await this.instance.methods.manufacturDrugsLoud(
                    udpc,
                    qty.toString()
                ).send({from: account})
                resolve(trxn)
            } catch(err) {
                reject(err);
            }
        });
    }

    packDrugLoad = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu } = data;
                const trxn = await this.instance.methods.packDrugsLoud(
                    slu,
                ).send({from: account})
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }

    sellDrugLoad = async(context, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu, u_price } = data;
                let priceInWei = context.library.utils.toWei(u_price)
                const trxn = await this.instance.methods.addDrugsLoud(
                    slu,
                    priceInWei
                ).send({from: context.account});
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }

    shipDrugLoad = async(account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu } = data;
                const trxn = await this.instance.methods.shipDrugsLoud(
                    slu
                ).send({from: account});
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }


    buyDrugLoad =  async (context, data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { slu, r_addr, price } = data;

                const valueInWei = context.library.utils.toWei(price)
                const retaileracount = r_addr
                const _ = context.library.utils.toChecksumAddress(retaileracount)
                const trxn = await this.instance.methods.buyDrugsLoud(
                  slu,
                  retaileracount)
                  .send({
                        from: context.account,
                        value: valueInWei
                    })
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }

    updateShipEnv = async (account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu, humidity, temprature} = data;
                const trxn = await this.instance.methods.updateDrugsLoudShippmentEnv(
                    slu,
                    humidity,
                    temprature	
                ).send({from: account});
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }

    updateStockEnv = async (account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu, humidity, temprature} = data;
                const trxn = await this.instance.methods.updateDrugsLoudStockEnv(
                    slu,
                    humidity,
                    temprature	
                ).send({from: account});
                resolve(trxn);
            } catch(err) {
                reject(err);
            }
        });
    }

    receiveDrugLoad = async (account, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { slu } = data;
                let tx = await this.instance.methods.receiveDrugsLoud(
                    slu
                ).send({from: account})
                resolve(tx)
            } catch(err) {
                reject(err);
            }
        });
    }

    buyDrug = async (context, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { pku, price } = data;
                let valueInWei = context.library.utils.toWei(price)
                let tx = await this.instance.methods.purchaseDrug(
                    pku,
                ).send({
                    from: context.account,
                    value: valueInWei
                })
                resolve(tx);
            } catch(err) {
                reject(err);
            }
        });
    }

}

export default ContractAPI;