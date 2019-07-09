<template>
    <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
        <a class="hd-cancel c-f-f60" slot="title" @click="saveData">保存</a>
        <ul class="top-flex-nav line line-x-b">
            <li :class="{'router-link-exact-active active': invoiceData.type == '0'}"
                @click="switchType('0')"
            ><a>公司发票</a></li>
            <li :class="{'router-link-exact-active active': invoiceData.type == '1'}"
                @click="switchType('1')"
            ><a>个人发票</a></li>
        </ul>

        <div class="form-field">
            <div class="form-field__title">
                <p class="form-field__title-text">
                    <span class="form-field__line"></span>
                    发票信息
                </p>
            </div>
            <div class="form-field__item">
                <div class="form-field__item-l">
                    发票抬头
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.invoiceTitle"
                           placeholder="请填写发票抬头"
                    >
                </div>
            </div>
            <div class="form-field__item">
                <div class="form-field__item-l">
                    纳税人识别号
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.invoiceNumber"
                           placeholder="请填写纳税人识别号"
                    >
                </div>
            </div>
            <div class="form-field__item">
                <div class="form-field__item-l">
                    开户银行
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.bank"
                           placeholder="请填写开户银行名称"
                    >
                </div>
            </div>
            <div class="form-field__item border-b-0">
                <div class="form-field__item-l">
                    银行账号
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.bankAccount"
                           placeholder="请填写开户银行卡账号"
                    >
                </div>
            </div>

            <div class="form-field__title">
                <p class="form-field__title-text">
                    <span class="form-field__line"></span>
                    取件信息
                </p>
            </div>
            <div class="form-field__item">
                <div class="form-field__item-l">
                    取件方式
                </div>
                <div class="form-field__item-r" @click="openPicker">
                    <input type="text" class="form-field__input"
                           readonly
                           v-model="invoiceData.pickupTypeName"
                           placeholder="请填写取件方式"
                    >
                </div>
            </div>
            <div class="form-field__item">
                <div class="form-field__item-l">
                    取件人
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.userName"
                           placeholder="请填写取件人姓名"
                    >
                </div>
            </div>
            <div class="form-field__item" v-show="invoiceData.pickupType == 1">
                <div class="form-field__item-l">
                    收件地址
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.address"
                           placeholder="请填写收件地址"
                    >
                </div>
            </div>
            <div class="form-field__item" v-show="invoiceData.pickupType == 1">
                <div class="form-field__item-l">
                    联系电话
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.phone"
                           placeholder="请填写您的联系电话"
                    >
                </div>
            </div>
            <div class="form-field__item border-b-0" v-show="invoiceData.pickupType == 0">
                <div class="form-field__item-l">
                    身份证号
                </div>
                <div class="form-field__item-r">
                    <input type="text" class="form-field__input"
                           :disabled="notAllowEdit"
                           v-model="invoiceData.idcard"
                           placeholder="请填写取件人身份证号"
                    >
                </div>
            </div>
            <p class="form-field__tip">
                <span class="text-left" v-if="invoiceData.pickupType==0">请携带取件人有效证件前来领取发票</span>
                <span class="text-right pull-right relative">
                    <span class="form-field__warning"></span>
                    开票说明
                </span>
            </p>
        </div>

    </main-box>
</template>

<script>
    import MainBox from 'components/mainBox/index.vue'
    import { mapState } from 'vuex'

    export default {
        components: {
            MainBox
        },
        data() {
            return {
                title:this.$route.meta.title,
                pageRouter: this.$route.name,
                notAllowEdit: this.$route.query.edit == '1' ? false:true,
                orderList: [],
                invoicePicker: '',
                invoiceData: {
                    pickupTypeName: '自取',
                    pickupType: 0, // 默认自取
                    type: 0, //0 公司发票 1 个人发票
                }
            }
        },
        mounted() {
            if(appStorage.get('invoice')) {
                this.invoiceData = JSON.parse(appStorage.get('invoice'));
            }
            this.createPicker();
        },
        computed: {

        },
        watch: {

        },
//        beforeRouteLeave(to, from, next) {
//            if(!this.validateFun()) {
//                next(false);
//                return false;
//            }
//
//            this.saveForm();
//            next();
//        },
        methods: {
            saveForm() {
              appStorage.set('invoice', JSON.stringify(this.invoiceData))
            },
            switchType(type) {
                if(this.notAllowEdit) {
                    return false;
                }
                this.invoiceData.type = type;
            },
            createPicker() {
                let that = this;
                let pickerData = [{text: '自取', value: 0},{text: '邮寄', value: 1}];
                this.invoicePicker = new Picker({
                    data: [
                        pickerData
                    ],
                    selectedIndex: [0],
                    title: '取件方式'
                });
                this.invoicePicker.on('picker.select', (selectedVal, selectedIndex) => {
                    this.invoiceData.pickupTypeName = pickerData[selectedIndex[0]].text;
                    this.invoiceData.pickupType = pickerData[selectedIndex[0]].value;
                })
            },
            openPicker() {
                if(this.notAllowEdit) {
                    return false;
                }
                this.invoicePicker.show();
            },
            saveData() {
                if(!this.validateFun()) {
                    return false;
                }

                this.saveForm();
              appStorage.set('needInvoice', 1);
                this.$router.go(-1);

            },
            validateFun() {
                let validateData = [
                    {value: this.invoiceData.invoiceTitle, emptyTips: '请填写发票抬头'},
                    {value: this.invoiceData.invoiceNumber, emptyTips: '请填写纳税人识别号'},
                    {value: this.invoiceData.bank, emptyTips: '请填写开户银行名称'},
                    {value: this.invoiceData.bankAccount, emptyTips: '请填写开户银行卡账号'},
                    {value: this.invoiceData.userName, emptyTips: '请填写取件人姓名'},
                ];
                if(this.invoiceData.pickupType == 1) {
                    validateData.push({value: this.invoiceData.address, emptyTips: '请填写收件地址'});
                    validateData.push({value: this.invoiceData.phone, emptyTips: '请填写您的联系电话', regName: 'telephone',regTips: '手机号码格式不正确'},)
                } else if(this.invoiceData.pickupType == 0) {
                    validateData.push({value: this.invoiceData.idcard, emptyTips: '请填写取件人身份证号', regName: 'idCard',regTips: '身份证号格式不正确'});
                }
                let validate = TOOL.formValidate(validateData);
                if (!validate.valid) {
                    this.$store.dispatch('showError', validate.msg);
                    return false;
                }
                return true;
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
