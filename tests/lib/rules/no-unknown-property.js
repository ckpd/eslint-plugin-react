/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unknown-property');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-unknown-property', rule, {
  valid: parsers.all([
    // React components and their props/attributes should be fine
    { code: '<App class="bar" />;' },
    { code: '<App for="bar" />;' },
    { code: '<App someProp="bar" />;' },
    { code: '<Foo.bar for="bar" />;' },
    { code: '<App accept-charset="bar" />;' },
    { code: '<App http-equiv="bar" />;' },
    {
      code: '<App xlink:href="bar" />;',
      features: ['jsx namespace'],
    },
    { code: '<App clip-path="bar" />;' },
    // Some HTML/DOM elements with common attributes should work
    { code: '<div className="bar"></div>;' },
    { code: '<div onMouseDown={this._onMouseDown}></div>;' },
    { code: '<a href="someLink">Read more</a>' },
    { code: '<img src="cat_keyboard.jpeg" alt="A cat sleeping on a keyboard" />' },
    { code: '<input type="password" required />' },
    { code: '<input ref={this.input} type="radio" />' },
    { code: '<input key="bar" type="radio" />' },
    { code: '<button disabled>You cannot click me</button>;' },
    { code: '<svg key="lock" viewBox="box" fill={10} d="d" stroke={1} strokeWidth={2} strokeLinecap={3} strokeLinejoin={4} transform="something" clipRule="else" x1={5} x2="6" y1="7" y2="8"></svg>' },
    { code: '<meta property="og:type" content="website" />' },
    { code: '<input type="checkbox" checked={checked} disabled={disabled} id={id} onChange={onChange} />' },
    // Case ignored attributes, for `charset` discussion see https://github.com/jsx-eslint/eslint-plugin-react/pull/1863
    { code: '<meta charset="utf-8" />;' },
    { code: '<meta charSet="utf-8" />;' },
    // Some custom web components that are allowed to use `class` instead of `className`
    { code: '<div class="foo" is="my-elem"></div>;' },
    { code: '<div {...this.props} class="foo" is="my-elem"></div>;' },
    { code: '<atom-panel class="foo"></atom-panel>;' },
    // data-* attributes should work
    { code: '<div data-foo="bar"></div>;' },
    { code: '<div data-foo-bar="baz"></div>;' },
    { code: '<div data-parent="parent"></div>;' },
    { code: '<div data-index-number="1234"></div>;' },
    // Ignoring should work
    {
      code: '<div class="bar"></div>;',
      options: [{ ignore: ['class'] }],
    },
    {
      code: '<div someProp="bar"></div>;',
      options: [{ ignore: ['someProp'] }],
    },

    // aria-* attributes should work
    { code: '<button aria-haspopup="true">Click me to open pop up</button>;' },
    { code: '<button aria-label="Close" onClick={someThing.close} />;' },
    // Attributes on allowed elements should work
    { code: '<script crossOrigin />' },
    { code: '<audio crossOrigin />' },
    { code: '<svg><image crossOrigin /></svg>' },
  ]),
  invalid: parsers.all([
    {
      code: '<div hasOwnProperty="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'hasOwnProperty',
          },
        },
      ],
    },
    {
      code: '<div abc="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'abc',
          },
        },
      ],
    },
    {
      code: '<div aria-fake="should not be allowed property"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'aria-fake',
          },
        },
      ],
    },
    {
      code: '<div someProp="bar"></div>;',
      errors: [
        {
          messageId: 'unknownProp',
          data: {
            name: 'someProp',
          },
        },
      ],
    },
    {
      code: '<div class="bar"></div>;',
      output: '<div className="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'class',
            standardName: 'className',
          },
        },
      ],
    },
    {
      code: '<div for="bar"></div>;',
      output: '<div htmlFor="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'for',
            standardName: 'htmlFor',
          },
        },
      ],
    },
    {
      code: '<div accept-charset="bar"></div>;',
      output: '<div acceptCharset="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'accept-charset',
            standardName: 'acceptCharset',
          },
        },
      ],
    },
    {
      code: '<div http-equiv="bar"></div>;',
      output: '<div httpEquiv="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'http-equiv',
            standardName: 'httpEquiv',
          },
        },
      ],
    },
    {
      code: '<div accesskey="bar"></div>;',
      output: '<div accessKey="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'accesskey',
            standardName: 'accessKey',
          },
        },
      ],
    },
    {
      code: '<div onclick="bar"></div>;',
      output: '<div onClick="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onclick',
            standardName: 'onClick',
          },
        },
      ],
    },
    {
      code: '<div onmousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onmousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<div onMousedown="bar"></div>;',
      output: '<div onMouseDown="bar"></div>;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'onMousedown',
            standardName: 'onMouseDown',
          },
        },
      ],
    },
    {
      code: '<use xlink:href="bar" />;',
      output: '<use xlinkHref="bar" />;',
      features: ['jsx namespace'],
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'xlink:href',
            standardName: 'xlinkHref',
          },
        },
      ],
    },
    {
      code: '<rect clip-path="bar" />;',
      output: '<rect clipPath="bar" />;',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'clip-path',
            standardName: 'clipPath',
          },
        },
      ],
    },
    {
      code: '<script crossorigin />',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<script crossOrigin />',
    },
    {
      code: '<div crossorigin />',
      errors: [
        {
          messageId: 'unknownPropWithStandardName',
          data: {
            name: 'crossorigin',
            standardName: 'crossOrigin',
          },
        },
      ],
      output: '<div crossOrigin />',
    },
    {
      code: '<div crossOrigin />',
      errors: [
        {
          messageId: 'invalidPropOnTag',
          data: {
            name: 'crossOrigin',
            tagName: 'div',
            allowedTags: 'script, img, video, audio, link, image',
          },
        },
      ],
    },
  ]),
});
