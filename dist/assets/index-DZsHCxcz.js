(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}})();function w(t){return t.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)?.[1]??""}function u(t){return`https://www.youtube.com/embed/${w(t)}`}function x(t){return t.toLocaleString(void 0,{minimumFractionDigits:3})}function R(t){return`https://img.youtube.com/vi/${t}/mqdefault.jpg`}function b(t){let e=t.length,i;for(;e!=0;)i=Math.floor(Math.random()*e),e--,[t[e],t[i]]=[t[i],t[e]];return t}const c=3;function p(t,e,i){if(t>150||t>75&&e<100)return 0;let l=(-24.9975*Math.pow(t-1,.4)+200)*((e-(i-1))/(100-(i-1)));return l=Math.max(0,l),e!=100?f(l-l/3):Math.max(f(l),0)}function f(t){if((""+t).includes("e")){var e=(""+t).split("e"),i="";return+e[1]+c>0&&(i="+"),+(Math.round(+e[0]+"e"+i+(+e[1]+c))+"e-"+c)}else return+(Math.round(t+"e+"+c)+"e-"+c)}const m="/data";async function g(){const t=await fetch(`${m}/_list.json`);try{const e=await t.json();return await Promise.all(e.map(async(i,l)=>{const s=await fetch(`${m}/${i}.json`);try{const r=await s.json();return[{...r,path:i,records:r.records.sort((o,n)=>n.percent-o.percent)},null]}catch{return console.error(`Failed to load level #${l+1} ${i}.`),[null,i]}}))}catch{return console.error("Failed to load list."),null}}async function T(){try{return await(await fetch(`${m}/_editors.json`)).json()}catch{return null}}async function E(){const t=await g(),e={},i=[];return t.forEach(([s,r],o)=>{if(r){i.push(r);return}const n=Object.keys(e).find(a=>a.toLowerCase()===s.verifier.toLowerCase())||s.verifier;e[n]??={verified:[],completed:[],progressed:[]};const{verified:h}=e[n];h.push({rank:o+1,level:s.name,score:p(o+1,100,s.percentToQualify),link:s.verification}),s.records.forEach(a=>{const d=Object.keys(e).find(S=>S.toLowerCase()===a.user.toLowerCase())||a.user;e[d]??={verified:[],completed:[],progressed:[]};const{completed:v,progressed:I}=e[d];if(a.percent===100){v.push({rank:o+1,level:s.name,score:p(o+1,100,s.percentToQualify),link:a.link});return}I.push({rank:o+1,level:s.name,percent:a.percent,score:p(o+1,a.percent,s.percentToQualify),link:a.link})})}),[Object.entries(e).map(([s,r])=>{const{verified:o,completed:n,progressed:h}=r,a=[o,n,h].flat().reduce((d,v)=>d+v.score,0);return{user:s,total:f(a),...r}}).sort((s,r)=>r.total-s.total),i]}const y={template:'<p class="spinner">Loading...</p>'},U={props:{author:{type:String,required:!0},creators:{type:Array,required:!0},verifier:{type:String,required:!0}},template:`
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Creator & Verifier</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
            </template>
            <template v-else-if="creators.length === 0">
                <div class="type-title-sm">Creator</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier }}</span>
                </p>
            </template>
            <template v-else>
                <div class="type-title-sm">Creators</div>
                <p class="type-body">
                    <template v-for="(creator, index) in creators" :key="\`creator-\${creator}\`">
                        <span >{{ creator }}</span
                        ><span v-if="index < creators.length - 1">, </span>
                    </template>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier }}</span>
                </p>
            </template>
            <div class="type-title-sm">Publisher</div>
            <p class="type-body">
                <span>{{ author }}</span>
            </p>
        </div>
    `,computed:{selfVerified(){return this.author===this.verifier&&this.creators.length===0}}},M={owner:"crown",admin:"user-gear",helper:"user-shield",dev:"code",trial:"user-lock"},j={components:{Spinner:y,LevelAuthors:U},template:`
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        Achieved the record without using hacks (however, FPS bypass is allowed, up to 360fps)
                    </p>
                    <p>
                        Achieved the record on the level that is listed on the site - please check the level ID before you submit a record
                    </p>
                    <p>
                        Have either source audio or clicks/taps in the video. Edited audio only does not count
                    </p>
                    <p>
                        The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this
                    </p>
                    <p>
                        The recording must also show the player hit the endwall, or the completion will be invalidated.
                    </p>
                    <p>
                        Do not use secret routes or bug routes
                    </p>
                    <p>
                        Do not use easy modes, only a record of the unmodified level qualifies
                    </p>
                    <p>
                        Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level
                    </p>
                </div>
            </div>
        </main>
    `,data:()=>({list:[],editors:[],loading:!0,selected:0,errors:[],roleIconMap:M,store:k}),computed:{level(){return this.list[this.selected][0]},video(){return this.level.showcase?u(this.toggledShowcase?this.level.showcase:this.level.verification):u(this.level.verification)}},async mounted(){this.list=await g(),this.editors=await T(),this.list?(this.errors.push(...this.list.filter(([t,e])=>e).map(([t,e])=>`Failed to load level. (${e}.json)`)),this.editors||this.errors.push("Failed to load list editors.")):this.errors=["Failed to load list. Retry in a few minutes or notify list staff."],this.loading=!1},methods:{embed:u,score:p}},O={components:{Spinner:y},data:()=>({leaderboard:[],loading:!0,selected:0,err:[]}),template:`
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,computed:{entry(){return this.leaderboard[this.selected]}},async mounted(){const[t,e]=await E();this.leaderboard=t,this.err=e,this.loading=!1},methods:{localize:x}},P={template:`
        <button class="btn">
            <span class="type-label-lg">
                <slot></slot>
            </span>
        </button>
    `},C={components:{Spinner:y,Btn:P},template:`
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-roulette">
            <div class="sidebar">
                <p class="type-label-md" style="color: #aaa">
                    Shameless copy of the Extreme Demon Roulette by <a href="https://matcool.github.io/extreme-demon-roulette/" target="_blank">matcool</a>.
                </p>
                <form class="options">
                    <div class="check">
                        <input type="checkbox" id="main" value="Main List" v-model="useMainList">
                        <label for="main">Main List</label>
                    </div>
                    <div class="check">
                        <input type="checkbox" id="extended" value="Extended List" v-model="useExtendedList">
                        <label for="extended">Extended List</label>
                    </div>
                    <Btn @click.native.prevent="onStart">{{ levels.length === 0 ? 'Start' : 'Restart'}}</Btn>
                </form>
                <p class="type-label-md" style="color: #aaa">
                    The roulette saves automatically.
                </p>
                <form class="save">
                    <p>Manual Load/Save</p>
                    <div class="btns">
                        <Btn @click.native.prevent="onImport">Import</Btn>
                        <Btn :disabled="!isActive" @click.native.prevent="onExport">Export</Btn>
                    </div>
                </form>
            </div>
            <section class="levels-container">
                <div class="levels">
                    <template v-if="levels.length > 0">
                        <!-- Completed Levels -->
                        <div class="level" v-for="(level, i) in levels.slice(0, progression.length)">
                            <a :href="level.video" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ level.rank }}</p>
                                <h2>{{ level.name }}</h2>
                                <p style="color: #00b54b; font-weight: 700">{{ progression[i] }}%</p>
                            </div>
                        </div>
                        <!-- Current Level -->
                        <div class="level" v-if="!hasCompleted">
                            <a :href="currentLevel.video" target="_blank" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(currentLevel.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ currentLevel.rank }}</p>
                                <h2>{{ currentLevel.name }}</h2>
                                <p>{{ currentLevel.id }}</p>
                            </div>
                            <form class="actions" v-if="!givenUp">
                                <input type="number" v-model="percentage" :placeholder="placeholder" :min="currentPercentage + 1" max=100>
                                <Btn @click.native.prevent="onDone">Done</Btn>
                                <Btn @click.native.prevent="onGiveUp" style="background-color: #e91e63;">Give Up</Btn>
                            </form>
                        </div>
                        <!-- Results -->
                        <div v-if="givenUp || hasCompleted" class="results">
                            <h1>Results</h1>
                            <p>Number of levels: {{ progression.length }}</p>
                            <p>Highest percent: {{ currentPercentage }}%</p>
                            <Btn v-if="currentPercentage < 99 && !hasCompleted" @click.native.prevent="showRemaining = true">Show remaining levels</Btn>
                        </div>
                        <!-- Remaining Levels -->
                        <template v-if="givenUp && showRemaining">
                            <div class="level" v-for="(level, i) in levels.slice(progression.length + 1, levels.length - currentPercentage + progression.length)">
                                <a :href="level.video" target="_blank" class="video">
                                    <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                                </a>
                                <div class="meta">
                                    <p>#{{ level.rank }}</p>
                                    <h2>{{ level.name }}</h2>
                                    <p style="color: #d50000; font-weight: 700">{{ currentPercentage + 2 + i }}%</p>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </section>
            <div class="toasts-container">
                <div class="toasts">
                    <div v-for="toast in toasts" class="toast">
                        <p>{{ toast }}</p>
                    </div>
                </div>
            </div>
        </main>
    `,data:()=>({loading:!1,levels:[],progression:[],percentage:void 0,givenUp:!1,showRemaining:!1,useMainList:!0,useExtendedList:!0,toasts:[],fileInput:void 0}),mounted(){this.fileInput=document.createElement("input"),this.fileInput.type="file",this.fileInput.multiple=!1,this.fileInput.accept=".json",this.fileInput.addEventListener("change",this.onImportUpload);const t=JSON.parse(localStorage.getItem("roulette"));t&&(this.levels=t.levels,this.progression=t.progression)},computed:{currentLevel(){return this.levels[this.progression.length]},currentPercentage(){return this.progression[this.progression.length-1]||0},placeholder(){return`At least ${this.currentPercentage+1}%`},hasCompleted(){return this.progression[this.progression.length-1]>=100||this.progression.length===this.levels.length},isActive(){return this.progression.length>0&&!this.givenUp&&!this.hasCompleted}},methods:{shuffle:b,getThumbnailFromId:R,getYoutubeIdFromUrl:w,async onStart(){if(this.isActive){this.showToast("Give up before starting a new roulette.");return}if(!this.useMainList&&!this.useExtendedList)return;this.loading=!0;const t=await g();if(t.filter(([l,s])=>s).length>0){this.loading=!1,this.showToast("List is currently broken. Wait until it's fixed to start a roulette.");return}const e=t.map(([l,s],r)=>({rank:r+1,id:l.id,name:l.name,video:l.verification})),i=[];this.useMainList&&i.push(...e.slice(0,75)),this.useExtendedList&&i.push(...e.slice(75,150)),this.levels=b(i).slice(0,100),this.showRemaining=!1,this.givenUp=!1,this.progression=[],this.percentage=void 0,this.loading=!1},save(){localStorage.setItem("roulette",JSON.stringify({levels:this.levels,progression:this.progression}))},onDone(){if(this.percentage){if(this.percentage<=this.currentPercentage||this.percentage>100){this.showToast("Invalid percentage.");return}this.progression.push(this.percentage),this.percentage=void 0,this.save()}},onGiveUp(){this.givenUp=!0,localStorage.removeItem("roulette")},onImport(){this.isActive&&!window.confirm("This will overwrite the currently running roulette. Continue?")||this.fileInput.showPicker()},async onImportUpload(){if(this.fileInput.files.length===0)return;const t=this.fileInput.files[0];if(t.type!=="application/json"){this.showToast("Invalid file.");return}try{const e=JSON.parse(await t.text());if(!e.levels||!e.progression){this.showToast("Invalid file.");return}this.levels=e.levels,this.progression=e.progression,this.save(),this.givenUp=!1,this.showRemaining=!1,this.percentage=void 0}catch{this.showToast("Invalid file.");return}},onExport(){const t=new Blob([JSON.stringify({levels:this.levels,progression:this.progression})],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download="tsl_roulette",e.click(),URL.revokeObjectURL(e.href)},showToast(t){this.toasts.push(t),setTimeout(()=>{this.toasts.shift()},3e3)}}},F=[{path:"/",component:j},{path:"/leaderboard",component:O},{path:"/roulette",component:C}],k=Vue.reactive({dark:JSON.parse(localStorage.getItem("dark"))||!1,toggleDark(){this.dark=!this.dark,localStorage.setItem("dark",JSON.stringify(this.dark))}}),L=Vue.createApp({data:()=>({store:k})}),_=VueRouter.createRouter({history:VueRouter.createWebHashHistory(),routes:F});L.use(_);L.mount("#app");
