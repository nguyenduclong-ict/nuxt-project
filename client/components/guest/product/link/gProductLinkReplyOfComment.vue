<template>
    <!--g_laptop_product_link_reply_of_comment-->

    <div>
        <!--Replys-->
        <div class="d-flex pl-6 mt-2" v-for="(reply, indexReply) in comment.reply" :key="indexReply">
            <!--Avatar User - Left-->  
            <v-avatar :size="SizeReply">
                <v-img :src="reply.user.profile.avatar" :alt="reply.user.profile.name"></v-img>
            </v-avatar>

            <!--Reply - Right-->
            <v-sheet class="ml-2">
                <!--Content-->
                <v-card flat class="rounded-xl py-2 px-4" color="box" min-height="40">
                    <div class="text-capitalize font-weight-bold">
                        <span :class="`${reply.user.role.toLowerCase()}--text`">{{reply.user.profile.name}}</span>
                    </div>

                    <span class="text-subtitle-1">{{reply.content}}</span>
                </v-card>
                
                <!--Information-->
                <div class="pl-4 mt-1">
                    <span>{{$dayjs(reply.create).fromNow()}}</span>
                </div>
            </v-sheet>
        </div>

        <!--Input Reply-->
        <div v-if="UserStore.authentic && comment.showInputReply" class="d-flex pl-6 mt-2">
            <v-avatar :size="SizeReply">
                <v-img :src="UserStore.profile.avatar" :alt="UserStore.profile.name"></v-img>
            </v-avatar>

            <v-form ref="form" class="ml-2" style="width: 100%" @submit.prevent="AddReply(comment)" v-model="Validate">
                <v-text-field
                    v-model="Reply"
                    full-width dense
                    :rules="[ $Rules.required, $Rules.multiSpace ]"
                    counter
                    maxlength="200"
                    placeholder="Trả lời bình luận"
                    :disabled="Loading.reply"
                    outlined rounded
                    color="primary"
                    autocomplete="off"
                ></v-text-field>
            </v-form>
        </div>
    </div>
</template>

<script>
export default {
    props: ['product', 'comment'],

    data () {
        return {
            Reply: '',
            Validate: true,
            Loading: {
                reply: false
            }
        }
    },

    computed: {
        UserStore() {
            return this.$store.state.user;
        },

        SizeReply () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 30
                case 'sm': return 40
                case 'md': return 40
                case 'lg': return 40
                case 'xl': return 40
            }
        }
    },

    methods: {
        //Add
        async AddReply (comment) {
            if(!this.$refs.form.validate()) return false;
            this.Loading.reply = true;

            try {
                let NewReply = await this.$axios.$post(this.$api.laptop.guest.AddReplyForComment, {
                    company: this.product.company._id,
                    trademark: this.product.trademark._id,
                    product: this.product._id,
                    comment: comment._id,
                    content: this.Reply
                });

                this.DoneAddReply(comment, NewReply);
                this.Loading.reply = false;
            }
            catch(e){
                this.Loading.reply = false;
                return false;
            }
        },

        //Done Add
        DoneAddReply (comment, NewReply) {
            NewReply.user = {
                _id: this.UserStore.id,
                profile: this.UserStore.profile,
                role: this.UserStore.role,
            };

            comment.reply.push(NewReply);

            this.$refs.form.reset();
        },
    }
}
</script>
