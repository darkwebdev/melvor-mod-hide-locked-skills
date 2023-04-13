const SkillCategories = [ 'Combat', 'Passive', 'Non-Combat' ];
const storagePrefix = 'hide-locked-skills';

export function setup({ onCharacterLoaded, characterStorage }) {
    onCharacterLoaded(() => {
        const hiddenCategories = SkillCategories.reduce((obj, catId) =>
            ({ ...obj, [catId]: characterStorage.getItem(`${storagePrefix}-${catId}`) || false }), {});

        const sidebarSkillCategories = sidebar.categories().reduce((obj, cat) =>
            SkillCategories.includes(cat.id) ? { ...obj, [cat.id]: cat } : obj, {});

        const toggleLockedSkills = (catId, doHide) => toggleLockedSkillItems(sidebarSkillCategories[catId].items(), doHide);

        Object.keys(sidebarSkillCategories).forEach(catId => {
            ui.create(Hider({
                hidden: hiddenCategories[catId] || false,
                onToggle: doHide => {
                    characterStorage.setItem(`${storagePrefix}-${catId}`, doHide);
                    toggleLockedSkills(catId, doHide);
                }
            }), sidebarSkillCategories[catId].categoryEl);
            toggleLockedSkills(catId, hiddenCategories[catId] || false);
        });
    });
}

function lockedSkillItems(categoryItems) {
    const charSkills = Array.from(game.skills.registeredObjects);
    return categoryItems.filter(item =>
        charSkills.some(skill => skill[0] === item.id && skill[1]._unlocked === false));
}

function toggleLockedSkillItems(categoryItems, hide) {
    lockedSkillItems(categoryItems).forEach(item => {
        if (hide) {
            item.rootEl.classList.add('hidden');
            item.rootEl.setAttribute('aria-hidden', 'true');
        } else {
            item.rootEl.classList.remove('hidden');
            item.rootEl.removeAttribute('aria-hidden');
        }
    });
}

function Hider({ hidden, onToggle = () => {}}) {
    return {
        $template: '#hide-locked-skills-component',
        hidden,
        toggle() {
            this.hidden = !this.hidden;
            onToggle(this.hidden);
        }
    };
}
