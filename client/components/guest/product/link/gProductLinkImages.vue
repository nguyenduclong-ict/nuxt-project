<template>
    <!--g_laptop_product_link_images-->

    <v-card flat tile class="Sticky_Top Sticky_Top--xl">
        <!--No Image-->
        <v-card-text v-if="images.length < 1" class="pa-0 pa-sm-4">
            <LazyHydrate when-visible>
                <v-alert type="info">Sản Phẩm Chưa Có Hình Ảnh</v-alert>
            </LazyHydrate>
        </v-card-text>

        <!--One Image-->
        <v-card-text v-else-if="images.length == 1" class="pa-0 pa-sm-4">
            <LazyHydrate when-visible>
                <v-img :src="$Image.Get(images[0], 'l')" :aspect-ratio="1.5" contain>
                    <template v-slot:placeholder>
                        <v-sheet width="100%" height="100%" color="card" class="d-flex justify-center align-center">
                            <v-progress-circular
                                indeterminate
                                color="primary"
                            ></v-progress-circular>
                        </v-sheet>
                    </template>
                </v-img>
            </LazyHydrate>
        </v-card-text>
        
        <!--Many Image-->
        <v-card-text v-else class="pa-0 pa-sm-4">
            <!--Slide Show-->
            <v-carousel
                v-model="ImageNow"
                cycle height="auto"
                :show-arrows-on-hover="ShowArrows"
                hide-delimiter-background
            >
                <v-carousel-item v-for="item in images" :key="item">
                    <LazyHydrate when-visible>
                        <v-img :src="$Image.Get(item, 'l')" :aspect-ratio="320/213" contain>
                            <!--Lazy Load-->
                            <template v-slot:placeholder>
                                <v-sheet width="100%" height="100%" color="card" class="d-flex justify-center align-center">
                                    <v-progress-circular
                                        indeterminate
                                        color="primary"
                                    ></v-progress-circular>
                                </v-sheet>
                            </template>
                        </v-img>
                    </LazyHydrate>
                </v-carousel-item>
            </v-carousel>

            <!--Mini List-->
            <v-sheet class="mt-4 d-none d-sm-block">
                <v-slide-group show-arrows center-active>
                    <v-slide-item v-for="(item, i) in images" :key="i" class="mr-1">
                        <LazyHydrate when-visible>
                            <v-card flat class="rounded-lg" :ripple="false" @click="ImageNow = i">
                                <v-img :src="$Image.Get(item, 's')" width="90" max-width="90" height="70" max-height="70"></v-img>
                            </v-card>
                        </LazyHydrate>
                    </v-slide-item>
                </v-slide-group>
            </v-sheet>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['images'],

    data () {
        return {
            ImageNow: 0
        }
    },

    computed: {
        ShowArrows () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return false
                case 'sm': return true
                case 'md': return true
                case 'lg': return true
                case 'xl': return true
            }
        },
    }
}
</script>