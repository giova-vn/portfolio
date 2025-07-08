//source of the idea: https://pineco.de/creating-a-simple-lightbox-vue-component/
//navigation buttons: https://www.w3schools.com/charsets/ref_utf_dingbats.asp

const imagePaths = "images/portfolio/picture_";

Vue.createApp({
  data() {
    return {
      images: [],
      selectedImageIndex: null,
      showLightbox: false,
    };
  },

  mounted() {
    this.loadImages();
  },
  
  computed: {
    current() {
      if (this.showLightbox && this.selectedImageIndex !== null && this.images[this.selectedImageIndex]) {
        return this.images[this.selectedImageIndex];
      }

      return null; 
    }
  },

  methods: {
    loadImages() {
      this.images = [];
      for (let i = 1; i <= 40; i++) { 
        this.images.push({
          id: 'pic-' + i, 
          src: imagePaths + i + ".jpg",
          alt: "Portfolio Image: " + i,
        });
      }
    },

    openLightbox(index) {
      this.selectedImageIndex = index;
      this.showLightbox = true;
    },

    closeLightbox() {
      this.showLightbox = false;
      this.selectedImageIndex = null;
    },

    nextImage() {
      if (this.selectedImageIndex !== null && this.images.length > 0) {
        this.selectedImageIndex = (this.selectedImageIndex + 1) % this.images.length;
      }
    },

    prevImage() {
      if (this.selectedImageIndex !== null && this.images.length > 0) {
        this.selectedImageIndex = (this.selectedImageIndex - 1 + this.images.length) % this.images.length;
      }
    },
  }, //end of methods

  template: `
<div class="portfolio_box">
    <img
        v-for="(image, index) in images"
        :key="image.id"
        :src="image.src"
        :alt="image.alt"
        @click="openLightbox(index)"
        class="portfolioPic"
    />

    <div v-if="showLightbox && current" class="lightbox" @click.self="closeLightbox">
        <div class="lightbox_content">
            <button class="lightbox_nav prev" @click.stop="prevImage">&#10094;</button>
            <img :src="current.src" :alt="current.alt" />
            <button class="lightbox_nav next" @click.stop="nextImage">&#10095;</button>
        </div>
    </div>
</div>
  `
}).mount("#portfolio-grid");