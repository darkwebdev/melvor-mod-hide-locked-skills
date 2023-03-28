const HideLockedCombatSkills = 'hide-locked-combat-skills';
const HideLockedNonCombatSkills = 'hide-locked-non-combat-skills';

export function setup({ onCharacterLoaded, characterStorage }) {
    onCharacterLoaded(() => {
        const lockedCombatSkillsHidden = characterStorage.getItem(HideLockedCombatSkills);
        const lockedNonCombatSkillsHidden = characterStorage.getItem(HideLockedNonCombatSkills);

        const sidebarCategories = sidebar.categories();
        const categoryCombat = sidebarCategories.find(c => c.id === 'Combat');
        const categoryNonCombat = sidebarCategories.find(c => c.id === 'Non-Combat');
        const toggleLockedCombatSkills = hidden => toggleLockedSkills(categoryCombat.items(), hidden);
        const toggleLockedNonCombatSkills = hidden => toggleLockedSkills(categoryNonCombat.items(), hidden);

        ui.create(Hider({
            hidden: lockedCombatSkillsHidden,
            onToggle: hidden => {
                characterStorage.setItem(HideLockedCombatSkills, hidden);
                toggleLockedCombatSkills(hidden);
            }
        }), categoryCombat.categoryEl);
        ui.create(Hider({
            hidden: lockedNonCombatSkillsHidden,
            onToggle: hidden => {
                characterStorage.setItem(HideLockedNonCombatSkills, hidden);
                toggleLockedNonCombatSkills(hidden);
            }
        }), categoryNonCombat.categoryEl);

        toggleLockedCombatSkills(lockedCombatSkillsHidden);
        toggleLockedNonCombatSkills(lockedNonCombatSkillsHidden);
    });
}

function lockedSkillItems(categoryItems) {
    const charSkills = Array.from(game.skills.registeredObjects);
    return categoryItems.filter(item =>
        charSkills.some(skill => skill[0] === item.id && skill[1]._unlocked === false));
}

function toggleLockedSkills(categoryItems, hide) {
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
