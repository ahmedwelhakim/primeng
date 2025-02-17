import { CommonModule } from '@angular/common';
import { Component, Directive, inject, Input, NgModule, TemplateRef } from '@angular/core';
import { ContextTypes } from './contexttypes';
type IfAnyThenElse<P, T, F> = 0 extends 1 & P ? T : F;
@Component({
    selector: 'p-header',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Header {}

@Component({
    selector: 'p-footer',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Footer {}

@Directive({
    selector: '[pTemplate]',
    standalone: true
})
export class PrimeTemplate {
    @Input() type: string | undefined;

    @Input('pTemplate') name: string | undefined;

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.name!;
    }
}
@Directive({
    selector: '[pTTemplate]',
    standalone: true
})
export class PrimeTypedTemplate<N extends keyof ContextTypes, CT extends ContextTypes[N]['$implicit'], C = ContextTypes[N]> {
    @Input({ required: true, alias: 'pTTemplate' }) name: N;
    @Input('pTTemplateContext') contextType: CT | undefined;

    template = inject<TemplateRef<C>>(TemplateRef);
    static ngTemplateContextGuard<N extends keyof ContextTypes, CT extends ContextTypes[N]['$implicit'], C = ContextTypes[N]>(dir: PrimeTypedTemplate<N, CT, C>, ctx: any): ctx is C & IfAnyThenElse<CT, C, { $implicit: CT }> {
        return true;
    }
    // static ngTemplateGuard_$implicit<N extends keyof ContextTypes, CT extends ContextTypes[N]['$implicit'], C>(dir: PrimeTypedTemplate<N, CT, C>, expr: any): expr is CT {
    //     if (dir.contextType) {
    //         return true;
    //     }
    //     return false;
    // }
    getType() {
        return this.name;
    }
}

@NgModule({
    imports: [CommonModule, PrimeTemplate, PrimeTypedTemplate],
    exports: [Header, Footer, PrimeTemplate, PrimeTypedTemplate],
    declarations: [Header, Footer]
})
export class SharedModule {}
