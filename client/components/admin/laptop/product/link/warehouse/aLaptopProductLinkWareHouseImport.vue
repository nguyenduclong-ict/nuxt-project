<template>
    <!--Laptop Product Link WareHouse-->

    <v-card>
        <!--Header-->
        <v-card-title class="font-weight-bold text-h4 create--text">Import WareHouse</v-card-title>
        <v-card-subtitle>Nhập kho sản phẩm</v-card-subtitle>

        <!--Body-->
        <v-form class="px-6 pb-0" ref="form" v-model="Validate">
            <v-alert type="info" color="create" text class="rounded-xl mb-6" prominent>
                Sau khi <strong>Nhập Kho</strong> sẽ không thể chỉnh sửa màu sắc và xóa kho hàng nếu đã đơn hàng liên quan !!!
            </v-alert>

            <!--Import-->
            <v-text-field
                v-model.number="NewImportWareHouse.import.price"
                :rules="[ $Rules.required, $Rules.price, $Rules.number ]"
                label="Import Price"                    
                placeholder="Giá nhập sản phẩm"
                color="create"
                type="number"
                autocomplete="off"
                filled rounded
                :disabled="Loading.import"
            >
                <template v-slot:append v-if="NewImportWareHouse.import.price">
                    <v-chip small class="font-weight-bold" color="create" dark>{{ $String.toPrice(NewImportWareHouse.import.price) }}</v-chip>
                </template>
            </v-text-field>

            <!--Export-->
            <v-text-field
                v-model.number="NewImportWareHouse.export.price"
                :rules="[ $Rules.required, $Rules.price, $Rules.number ]"
                label="Export Price"                    
                placeholder="Giá bán sản phẩm"
                color="create"
                type="number"
                autocomplete="off"
                filled rounded
                :disabled="Loading.import"
            >
                <template v-slot:append v-if="NewImportWareHouse.export.price">
                    <v-chip small class="font-weight-bold" color="create" dark>{{ $String.toPrice(NewImportWareHouse.export.price) }}</v-chip>
                </template>
            </v-text-field>

            <!--Color-->
            <div>
                <!--Select-->
                <v-sheet class="d-flex align-center mb-7 px-4 py-2 rounded-pill" color="heading">
                    <span class="grey--text">Chọn Màu</span>

                    <v-spacer></v-spacer>

                    <v-btn
                        v-for="(color, indexColor) in variant.colors"
                        :key="indexColor" dark
                        fab small elevation="0"
                        :color="color.code" 
                        @click="AddColorToImport(color)"
                    ></v-btn>
                </v-sheet>

                <!--Input-->
                <v-sheet v-for="(warehouseColor, indexColor) in NewImportWareHouse.colors" :key="indexColor">
                    <div class="d-flex">
                        <v-btn fab elevation="0"  width="52" height="52" :color="FindColorByID(warehouseColor.information)"></v-btn>

                        <v-sheet class="ml-2">
                            <v-text-field
                                v-model.number="warehouseColor.import.amount"
                                :rules="[ $Rules.required, $Rules.number ]"
                                label="Import Amount"                    
                                placeholder="Số lượng nhập"
                                color="create"
                                type="number"
                                autocomplete="off"
                                filled rounded dense
                                :disabled="Loading.import"
                                class="d-inline-flex"
                            ></v-text-field>

                            <v-text-field
                                v-model.number="warehouseColor.export.upprice"
                                :rules="[ $Rules.price ]"
                                label="Export Up Price"                    
                                placeholder="Tăng giá so với gốc"
                                color="create"
                                type="number"
                                autocomplete="off"
                                filled rounded dense
                                :disabled="Loading.import"
                                class="d-inline-flex"
                            ></v-text-field>
                        </v-sheet>

                        <v-spacer></v-spacer>

                        <v-btn fab elevation="0" x-small color="delete" dark class="mt-3" @click="$delete(NewImportWareHouse.colors, indexColor)"><v-icon>delete</v-icon></v-btn>
                    </div>
                </v-sheet>
            </div>
        </v-form>

        <!--Footer-->
        <v-card-actions class="px-6 py-4 pt-0">
            <v-spacer></v-spacer>
            
            <v-btn 
                rounded elevation="0" large 
                :disabled="Loading.import"
                @click="Cancel"
            >
                Hủy
            </v-btn>
            
            <v-btn 
                color="create" dark 
                rounded elevation="0" 
                large class="mx-0" 
                :loading="Loading.import"
                @click="ImportWarehouse"
            >
                Nhập Kho
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: ['variant'],
    data () {
        return {
            Validate: true,
            NewImportWareHouse: {
                company: null,
                trademark: null,
                product: null,
                variant: null,

                import: {
                    price: null
                },
                export: {
                    price: null
                },

                colors: []
            },
            Loading: {
                import: false
            }
        }
    },

    methods: {
        FindColorByID (id) {
            let color = this.variant.colors.find(e => e._id == id);

            return color.code;
        },

        AddColorToImport (color) {
            let Get = this.NewImportWareHouse.colors.find(e => e.information == color._id);
            if(Get) return false;

            this.NewImportWareHouse.colors.push({
                company: this.variant.company,
                trademark: this.variant.trademark,
                product: this.variant.product,
                variant: this.variant._id,
                warehouse: null,
                information: color._id,
                import: {
                    amount: null
                },
                export: {
                    upprice: null
                }
            });
        },

        async ImportWarehouse () {
            if(!this.$refs.form.validate()) return false;
            if(this.NewImportWareHouse.colors.length < 1) return false;

            this.Loading.import = true;

            try {
                this.NewImportWareHouse.company = this.variant.company;
                this.NewImportWareHouse.trademark = this.variant.trademark;
                this.NewImportWareHouse.product = this.variant.product;
                this.NewImportWareHouse.variant = this.variant._id;

                let NewImportWareHouse = await this.$axios.$post(this.$api.laptop.admin.ImportWareHouse, this.NewImportWareHouse);

                this.Loading.import = false;
                this.Update(NewImportWareHouse);
            }
            catch(e){
                this.Loading.import = false;
            }
        },

        Update (NewWarehouse) {
            this.variant.warehouses.push(NewWarehouse);

            this.Cancel();
        },

        Cancel () {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();

            this.NewImportWareHouse.colors = [];

            this.$emit('cancel');
        }
    }
}
</script>